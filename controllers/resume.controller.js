
'use strict'

/**
 * @type {import('mongoose').Model}
 */
const { Resume } = require('../models')
const { StatusCodes } = require('http-status-codes')
const { ConflictError } = require('../errors')
const { authorize } = require('../utils')

module.exports = { index, show, insert, destroy, update }

/**
 * Get resume from all account, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function index (req, res, next) {
    try {
        const resumes = await Resume.find({}, {}, { sort: { createdAt: 'desc' } })
        res.status(StatusCodes.OK).send({ data: resumes })
    } catch (error) {
        next(error)
    }
}

/**
 * Show one resume from the given id, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function show (req, res, next) {
    try {
        const resume = await Resume.findOne({ _id: req.params.id })
        res.status(StatusCodes.OK).send({ data: resume })
    } catch (error) {
        next(error)
    }
}

/**
 * Create a new resume for an account, everyone has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function insert (req, res, next) {
    try {
        const { id } = req.user
        const hasResume = await Resume.exists({ account_id: id })
        if (hasResume) throw new ConflictError('Already have resume')
        req.body.account_id = id
        const resumes = await Resume.create(req.body)
        res.status(StatusCodes.OK).send({ message: 'Success creating resume!', data: resumes })
    } catch (error) {
        next(error)
    }
}

/**
 * Update the existing resume, the owner of the resume has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function update (req, res, next) {
    try {
        const { id } = req.params
        const { technicalSkill, education, personalBackground, experience } = req.body
        const resume = await Resume.findById(id)
        authorize(req.user, resume.account_id.toString())
        if (technicalSkill) resume.technical_skill = technicalSkill
        if (education) resume.education = education
        if (personalBackground) resume.personal_background = personalBackground
        if (experience) resume.experience = experience
        await resume.save()
        res.status(StatusCodes.OK).send({ message: 'Success updating resume!' })
    } catch (error) {
        next(error)
    }
}

/**
 * Delete a resume permanently by id, the owner of the resume has rights
 * @param {Request} req
 * @param {Response} res
 * @param {VoidFunction} next
 */
async function destroy (req, res, next) {
    try {
        const { id } = req.params
        const resume = await Resume.findById(id)
        authorize(req.user, resume.account_id.toString())
        res.status(StatusCodes.OK).send({ message: 'Success deleting resume!' })
    } catch (error) {
        next(error)
    }
}
