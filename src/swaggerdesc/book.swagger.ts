/**
 * @swagger
 * tags:
 *   name: Books
 *   description: Books management
 */

/**
 * @swagger
 * /api/books:
 *   get:
 *     summary: Get all books (paginated, with optional filters)
 *     tags: [Books]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 4
 *         description: Items per page (max 100)
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Filter by title (case-insensitive partial match)
 *         example: dune
 *       - in: query
 *         name: author
 *         schema:
 *           type: string
 *         description: Filter by author (case-insensitive partial match)
 *         example: herbert
 *       - in: query
 *         name: genreIds
 *         schema:
 *           type: string
 *         description: Filter by genre IDs (comma-separated UUIDs)
 *         example: "550e8400-e29b-41d4-a716-446655440001,550e8400-e29b-41d4-a716-446655440002"
 *     responses:
 *       200:
 *         description: Paginated list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       title:
 *                         type: string
 *                       author:
 *                         type: string
 *                       description:
 *                         type: string
 *                       releaseDate:
 *                         type: string
 *                         format: date
 *                       pages:
 *                         type: integer
 *                       genres:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *                 meta:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *
 *   post:
 *     summary: Create a new book
 *     tags: [Books]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, author, genreIds]
 *             properties:
 *               title:
 *                 type: string
 *                 minLength: 2
 *                 example: Dune
 *               author:
 *                 type: string
 *                 minLength: 2
 *                 example: Frank Herbert
 *               description:
 *                 type: string
 *                 example: A science fiction epic
 *               releaseDate:
 *                 type: string
 *                 format: date
 *                 example: "1965-08-01"
 *               pages:
 *                 type: integer
 *                 example: 688
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: One or more genres not found
 *       409:
 *         description: Book already exists
 */

/**
 * @swagger
 * /api/books/{id}:
 *   get:
 *     summary: Get book by ID
 *     tags: [Books]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Book found
 *       404:
 *         description: Book not found
 *
 *   patch:
 *     summary: Update book by ID
 *     tags: [Books]
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
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               description:
 *                 type: string
 *               releaseDate:
 *                 type: string
 *                 format: date
 *               pages:
 *                 type: integer
 *               genreIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *     responses:
 *       200:
 *         description: Book updated
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 *
 *   delete:
 *     summary: Delete book by ID
 *     tags: [Books]
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
 *         description: Book deleted
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Book not found
 */
