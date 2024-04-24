const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../app');
const mongoose = require('mongoose');
const Translation = require('../models/Translation.model');

function generateMockToken() {
  return jwt.sign({ userId: 'mockUserId' }, process.env.JWT_TOKEN_KEY, {
    expiresIn: '1h',
  });
}

afterAll((done) => {
  mongoose.connection.close();
  done();
});

describe('/api/translateHistory', () => {
  let translationId;
  const translationData = {
    uid: 'user_id',
    inputLang: 'Python',
    outputLang: 'Java',
    inputCode: '# test comment',
    outputCode: '// test comment',
    status: 200,
    translatedAt: new Date('December 17, 1995 03:24:00'),
  };

  beforeEach(async () => {
    const newTranslation = await Translation.create(translationData);
    translationId = newTranslation._id;
  });

  test('POST /api/translateHistory', async () => {
    const token = generateMockToken();
    return await request(app)
      .post('/api/translateHistory')
      .send(translationData)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.Message).toEqual('Translation saved!');
      });
  });

  test('GET /api/translateHistory/:uid', async () => {
    const token = generateMockToken();
    return await request(app)
      .get(`/api/translateHistory/${translationData.uid}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.Translations.length).toBeGreaterThan(0);
      });
  });

  test('PUT /api/translateHistory/:id', async () => {
    const updatedTranslationData = {
      ...translationData,
      inputLang: 'JavaScript',
    };
    const token = generateMockToken();
    return await request(app)
      .put(`/api/translateHistory/${translationId}`)
      .send(updatedTranslationData)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.UpdatedTranslation.inputLang).toBe('JavaScript');
      });
  });

  test('DELETE /api/translateHistory/:id', async () => {
    const token = generateMockToken();
    return await request(app)
      .delete(`/api/translateHistory/${translationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.Message).toBe('Translation deleted successfully');
      });
  });

  test('DELETE /api/translateHistory/clearHistory/:uid', async () => {
    const token = generateMockToken();
    return await request(app)
      .delete(`/api/translateHistory/clearHistory/user_id`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.Message).toBe(
          'Translation history cleared successfully'
        );
      });
  });
});

describe('Error Handling', () => {
  test('POST /api/translateHistory - Error handling for missing input data', async () => {
    const token = generateMockToken();
    const incompleteData = {
      inputLang: 'Python',
      outputLang: 'Java',
    };

    await request(app)
      .post('/api/translateHistory')
      .send(incompleteData)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.error).toBe(
          'Translation validation failed: uid: Path `uid` is required., inputCode: Path `inputCode` is required., outputCode: Path `outputCode` is required., status: Path `status` is required., translatedAt: Path `translatedAt` is required.'
        );
      });
  });

  test('PUT /api/translateHistory/:id - Error handling for non-existing translation ID', async () => {
    const token = generateMockToken();
    const nonExistingTranslationId = '54edb381a13ec9142b9bb353';

    await request(app)
      .put(`/api/translateHistory/${nonExistingTranslationId}`)
      .send({ inputLang: 'JavaScript' })
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.error).toBe('Translation not found.');
      });
  });

  test('DELETE /api/translateHistory/:id - Error handling for invalid translation ID', async () => {
    const token = generateMockToken();
    const invalidTranslationId = 'invalid_translation_id';

    await request(app)
      .delete(`/api/translateHistory/${invalidTranslationId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(500)
      .expect('Content-Type', /json/)
      .then((response) => {
        expect(response.body.error).toBe(
          `Cast to ObjectId failed for value \"${invalidTranslationId}\" (type string) at path \"_id\" for model \"Translation\"`
        );
      });
  });
});
