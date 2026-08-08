/**
 * @swagger
 * tags:
 *   name: Bookshelves
 *   description: Bookshelf management (requires authentication)
 */

/**
 * @swagger
 * /api/bookshelves:
 *   get:
 *     summary: Get all bookshelves of current user
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of bookshelves
 *       401:
 *         description: Unauthorized
 *
 *   post:
 *     summary: Create a new bookshelf
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Favourites
 *     responses:
 *       201:
 *         description: Bookshelf created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Bookshelf with this name already exists
 */

/**
 * @swagger
 * /api/bookshelves/{id}:
 *   get:
 *     summary: Get bookshelf by ID
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bookshelf found
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bookshelf not found
 *
 *   patch:
 *     summary: Update bookshelf name
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Bookshelf updated
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bookshelf not found
 *
 *   delete:
 *     summary: Delete bookshelf
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Bookshelf deleted
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bookshelf not found
 */

/**
 * @swagger
 * /api/bookshelves/{id}/items:
 *   get:
 *     summary: Get all books on a bookshelf
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: List of bookshelf items with book details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bookshelf not found
 *
 *   post:
 *     summary: Add a book to bookshelf
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
 *             required: [bookId]
 *             properties:
 *               bookId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Book added to bookshelf
 *       400:
 *         description: bookId is required
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bookshelf or book not found
 *       409:
 *         description: Book already on bookshelf
 */

/**
 * @swagger
 * /api/bookshelves/{id}/items/{bookId}:
 *   patch:
 *     summary: Update book status or favourite on bookshelf
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
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
 *               readStatus:
 *                 type: string
 *                 enum: [PLANNED, READING, COMPLETED]
 *               isFavorite:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Item updated
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bookshelf or book not found
 *
 *   delete:
 *     summary: Remove book from bookshelf
 *     tags: [Bookshelves]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *       - in: path
 *         name: bookId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Book removed from bookshelf
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Bookshelf or book not found
 */
