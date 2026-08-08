/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Book reviews management
 */

/**
 * @swagger
 * /api/books/{bookId}/reviews:
 *   get:
 *     summary: Get all reviews for a book
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of reviews
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   rating:
 *                     type: integer
 *                     minimum: 1
 *                     maximum: 5
 *                   comment:
 *                     type: string
 *                   createdAt:
 *                     type: string
 *                     format: date-time
 *                   user:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       404:
 *         description: Book not found
 *
 *   post:
 *     summary: Create a review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [rating]
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 5
 *               comment:
 *                 type: string
 *                 maxLength: 500
 *                 example: Great book!
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *       409:
 *         description: Review already exists for this book
 *
 *   patch:
 *     summary: Update your review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Review updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 *
 *   delete:
 *     summary: Delete your review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Review deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */

/**
 * @swagger
 * /api/books/{bookId}/reviews/my:
 *   get:
 *     summary: Get your review for a book
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Your review
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Review not found
 */
