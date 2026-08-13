import type { Request, Response } from 'express'
import { readFile, writeFile } from 'node:fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

const fileName = fileURLToPath(import.meta.url)
const dirName = path.dirname(fileName)

const filePath = path.join(dirName, '..', 'data', 'employees.json')

const getAllEmployees = async (req: Request, res: Response) => {
    const data = await readFile(filePath, 'utf-8')
    res.json(JSON.parse(data))
}

const createEmployee = async (req: Request, res: Response) => {
    const { firstname, lastname } = req.body
    const data = JSON.parse(await readFile(filePath, 'utf-8'))
    const newEmployee = { id: data.length + 1, firstname, lastname }
    data.push(newEmployee)
    await writeFile(filePath, JSON.stringify(data))
    res.status(201).json(newEmployee)
}

const updateEmployee = async (req: Request, res: Response) => {
    const { id, firstname, lastname } = req.body
    const data = JSON.parse(await readFile(filePath, 'utf-8'))
    const employee = data.find((emp: any) => emp.id == id)
    if (!employee) return res.status(404).json({message: "Employee not found"})
    employee.firstname = firstname
    employee.lastname = lastname
    await writeFile(filePath, JSON.stringify(data))
    res.json(employee)
}

const deleteEmployee = async (req: Request, res: Response) => {
    const { id } = req.body
    const data = JSON.parse(await readFile(filePath, 'utf-8'))
    const filtered = data.find((emp: any) => (emp.id !== id))
    if (filtered.length === data.length) return res.status(404).json({message: "Employee not found"})
    await writeFile(filePath, JSON.stringify(filtered))
    res.json({message: `Emplyee ${id} deleted`})
}

const getEmployee = async (req: Request, res: Response) => {
    const data = JSON.parse(await readFile(filePath, 'utf-8'))
    const employee = data.find((emp: any) => emp.id === parseInt(req.params['id'] as string))
    if (!employee) return res.status(404).json({message: 'Employee not found'})
    res.json(employee)
}

export { getAllEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee }