const { auth, logInWithEmailAndPassword, registerWithEmailAndPassword, signInWithGoogle, signInWithGithub, changePassword, thirdPartySignin, deleteAccount, resetPasswordEmail } = require('../firebase');
let firebase = require('firebase/auth')

jest.mock('firebase/auth', () => {
  const originalModule = jest.requireActual('firebase/auth');
  return {
    ...originalModule,
    getAuth: jest.fn(() => ({
      currentUser: { 
        providerData: [{ providerId: "password" }],
        authStateReady: jest.fn()
      },
    })),
  };
});

jest.mock('firebase/auth')
describe("testing local auth functions in firebase.js", () => {
  describe('changePassword', () => {
    it('should return true if update was successful', async () => {
      firebase.updatePassword = jest.fn(() => {})
      const output = await changePassword('MockPassword');
      expect(output).toBe(true);
    });
    it('should throw error if weak password', async () => {
      firebase.updatePassword = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.WEAK_PASSWORD))
      expect(async () =>
        await changePassword("MockPassword")).rejects.toThrow("Please choose a stronger password!");
    });
    it('should throw error if issue occurred during password update', async () => {
      firebase.updatePassword = jest.fn().mockRejectedValue(new Error())
      expect(async () =>
        await changePassword("MockPassword")).rejects.toThrow(Error);
    });
    describe('thirdPartySignIn', () => {
      it('should return signInWithPopup user output if sign in was successful', async () => {
        firebase.signInWithPopup = jest.fn(async () => Promise.resolve({
          user: {
            displayName: 'MockDisplayName', email: 'MockEmail', uid: 'MockUid'}
        }))
        const output = await thirdPartySignin('MockProvider')
        expect(output.name).toBe('MockDisplayName')
        expect(output.email).toBe('MockEmail')
        expect(output.uid).toBe('MockUid')
      })
      it('should throw error if issue occurred while signing in with popup', async () => {
        firebase.signInWithPopup = jest.fn().mockRejectedValue(new Error())
        expect(async () =>
        await firebase.signInWithPopup("MockProvider")).rejects.toThrow(Error);
      })
    })
  })
  describe('deleteAccount', () => {
    it('should call delete user firebase function', async () => {
      firebase.deleteUser = jest.fn()
      await deleteAccount()
      expect(firebase.deleteUser).toHaveBeenCalled()
    })
    it('should log error if user deletion unsuccessful', async () => {
      const consoleSpy = jest.spyOn(console, 'error')
      firebase.deleteUser = jest.fn().mockRejectedValue(new Error())
      await deleteAccount()
      expect(consoleSpy).toHaveBeenCalled()
    })
  })
  describe('resetPasswordEmail', () => {
    it('should call send reset email firebase function', async () => {
      firebase.sendPasswordResetEmail = jest.fn()
      await resetPasswordEmail()
      expect(firebase.sendPasswordResetEmail).toHaveBeenCalled()
    })
    it('should log error if sending email unsuccessful', async () => {
      const consoleSpy = jest.spyOn(console, 'error')
      firebase.sendPasswordResetEmail = jest.fn().mockRejectedValue(new Error())
      await resetPasswordEmail()
      expect(consoleSpy).toHaveBeenCalled()
    })
  })
  describe("testing email/pass registration", () => {
    test("Empty Name", () => {
      expect(async () =>
        await registerWithEmailAndPassword("", "test", "test", "test")).rejects.toThrow("Please fill in all fields!");
    });
    test("Empty Email", () => {
      expect(async () =>
        await registerWithEmailAndPassword("test", "", "test", "test")).rejects.toThrow("Please fill in all fields!");
    });
    test("Empty Password", () => {
      expect(async () =>
        await registerWithEmailAndPassword("test", "test", "", "test")).rejects.toThrow("Please fill in all fields!");
    });
    test("Empty Confirm Password", () => {
      expect(async () =>
        await registerWithEmailAndPassword("test", "test", "test", "")).rejects.toThrow("Please fill in all fields!");
    });
    test("Invalid Email", () => {
      expect(async () =>
        await registerWithEmailAndPassword("test", "test", "test", "test")).rejects.toThrow("Invalid email!");
    });
    test("Passwords don't march", () => {
      expect(async () =>
        await registerWithEmailAndPassword("test", "test@gmail.com", "test", "test123")).rejects.toThrow("Passwords do not match!");
    });
    test("Weak Password", () => {
      firebase.createUserWithEmailAndPassword = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.WEAK_PASSWORD))
      expect(async () => await registerWithEmailAndPassword("test", "test@gmail.com", "test", "test")).rejects.toThrow('Please choose a stronger password!');
    });
    test("Email Exists", () => {
      firebase.createUserWithEmailAndPassword = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.EMAIL_EXISTS))
      expect(async () => await registerWithEmailAndPassword("test", "test@gmail.com", "test", "test")).rejects.toThrow('This email is already in use!');
    });
    test("Invalid Email - Firebase Side", () => {
      firebase.createUserWithEmailAndPassword = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.INVALID_EMAIL))
      expect(async () => await registerWithEmailAndPassword("test", "test@gmail.com", "test", "test")).rejects.toThrow('Invalid email!');
    });
    test("Returns user successfuly", async () => {
      const mockedReturn = { user: { uid: "test" } }
      firebase.createUserWithEmailAndPassword = jest.fn(() => mockedReturn)
      const val = await registerWithEmailAndPassword("test", "test@gmail.com", "test", "test");
      expect(val).toBe('test');
    });
  })
  describe("testing email/pass login", () => {
    test("Empty Email", () => {
      expect(async () =>
        await logInWithEmailAndPassword("", "")).rejects.toThrow("Please fill in all fields!");
    });
    test("Empty Password", () => {
      expect(async () =>
        await logInWithEmailAndPassword("test", "")).rejects.toThrow("Please fill in all fields!");
    });
    test("Returns user successfuly", async () => {
      const mockedReturn = { user: { uid: "test" } }
      firebase.signInWithEmailAndPassword = jest.fn(() => mockedReturn)
      const val = await logInWithEmailAndPassword("test@gmail.com", "test");
      expect(val).toBe('test');
    });
    test("Invalid Credentials", ()=>{
      firebase.signInWithEmailAndPassword = jest.fn().mockRejectedValue(new Error("The email and/or password you entered is incorrect!"))
      expect(async () => await logInWithEmailAndPassword("test@gmail.com","test")).rejects.toThrow('The email and/or password you entered is incorrect!');
    });

  })

  describe("Google Sign In", () => {
    test("Returns user successfuly", async () => {
      const mockedReturn = { user: { displayName: "test", email: "test", uid: "test" } }
      firebase.signInWithPopup = jest.fn(() => mockedReturn)
      const val = await signInWithGoogle();
      const expectedReturn = { name: "test", email: "test", uid: "test" };
      expect(val).toStrictEqual(expectedReturn);
    });
    test("Email Exists", () => {
      firebase.signInWithPopup = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.NEED_CONFIRMATION))
      expect(async () => await signInWithGoogle()).rejects.toThrow('This email is in use through a different service!');
    });

  })

  describe("Github Sign In", () => {
    test("Returns user successfuly", async () => {
      const mockedReturn = { user: { displayName: "test", email: "test", uid: "test" } }
      firebase.signInWithPopup = jest.fn(() => mockedReturn)
      const val = await signInWithGithub();
      const expectedReturn = { name: "test", email: "test", uid: "test" };
      expect(val).toStrictEqual(expectedReturn);
    });
    test("Email Exists", () => {
      firebase.signInWithPopup = jest.fn().mockRejectedValue(new Error(firebase.AuthErrorCodes.NEED_CONFIRMATION))
      expect(async ()=> await signInWithGithub()).rejects.toThrow('This email is in use through a different service!');
    });
  })
})
