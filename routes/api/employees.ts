import express from 'express'
import { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../../controllers/employeesController.js'

const router = express.Router()

router.route('/')
    .get(getAllEmployees)
    .post(createEmployee)
    .put(updateEmployee)
    .delete(deleteEmployee)

router.route('/:id')
    .get(getEmployee)

export default router