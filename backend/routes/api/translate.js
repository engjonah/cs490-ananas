const router = require('express').Router();
const translateController = require('../../controllers/translateController');
const expressQueue = require('express-queue');
const requireAuth = require("../../middleware/requireAuth")

router.use(requireAuth)
const queue = expressQueue({ activeLimit: 1, queuedLimit: -1 });

queue.queue.on("queue", (job) => {
  job.data.req.queueDepth = job.queue.getLength();
  console.log("queue length", job.data.req.queueDepth);
});const router = require('express').Router();
const translateController = require('../../controllers/translateController');
const expressQueue = require('express-queue');
const rateLimit = require('express-rate-limit'); // Import express-rate-limit
const requireAuth = require("../../middleware/requireAuth");

// Middleware to require authentication
router.use(requireAuth);

// Rate limiter configuration
const translateRateLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute window
  max: 3, // limit each user to 3 requests per windowMs
  message: "Too many requests, please try again later.", // message to return when rate limit is exceeded
  keyGenerator: (req) => {
    // Assuming user identification through req.user.id, modify as per your auth setup
    return req.user.id;
  },
  handler: (req, res, /*next, options*/) => {
    return res.status(429).json({
      error: "Too many requests, please try again later."
    });
  }
});

// Apply the rate limiter middleware before the queue middleware
router.use(translateRateLimiter);

// Queue configuration
const queue = expressQueue({ activeLimit: 1, queuedLimit: -1 });

queue.queue.on("queue", (job) => {
  job.data.req.queueDepth = job.queue.getLength();
  console.log("Queue length:", job.data.req.queueDepth);
});

// Apply queue middleware
router.use(queue);

// Route handler for translations
router.post("/", translateController.getTranslation);

module.exports = router;


router.use(queue);
router.post("/", translateController.getTranslation)

module.exports = router;
