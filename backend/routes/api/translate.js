const router = require('express').Router();
const translateController = require('../../controllers/translateController');
const expressQueue = require('express-queue');

const queue = expressQueue({ activeLimit: 1, queuedLimit: -1 });

queue.queue.on("queue", (job) => {
  job.data.req.queueDepth = job.queue.getLength();
  console.log("queue length", job.data.req.queueDepth);
});

router.use(queue);
router.post("/", translateController.getTranslation)

module.exports = router;