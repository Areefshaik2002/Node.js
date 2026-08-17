import express from 'express'
import { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee } from '../../controllers/employeesController.js'
import { ROLES_LIST } from '../../config/roles_list.js';
import { verifyRoles } from '../../middleware/verifyRoles.js';

const router = express.Router()

router.route('/')
    .get(getAllEmployees)
    .post(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), createEmployee)
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), updateEmployee)
    .delete(verifyRoles(ROLES_LIST.Admin), deleteEmployee)

router.route('/:id')
    .get(getEmployee)

export default router