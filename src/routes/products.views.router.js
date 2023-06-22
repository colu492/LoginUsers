import { Router } from "express"
import {productModel} from "../dao/models/product.model.js"

const router = Router()

router.get("/", async (req, res) => {

    // Obtener los parámetros de consulta opcionales
    const limit = req.query?.limit || 10
    const page = req.query?.page || 1
    const filter = req.query?.filter || ''
    const sortQuery = req.query?.sort || ''
    const sortQueryOrder = req.query?.sortorder || 'desc'

    // Construir el objeto de búsqueda según el filtro
    const search = {}
    if(filter) {
        search.title = filter
    }

    // Construir el objeto de ordenamiento según el parámetro de orden y dirección
    const sort = {}
    if (sortQuery) {
        sort[sortQuery] = sortQueryOrder
    }

    // Configurar las opciones de paginación y ordenamiento
    const options = {
        limit, 
        page, 
        sort,
        lean: true
    }
    
    // Realizar la consulta paginada con búsqueda y opciones
    const data = await productModel.paginate(search, options)
    console.log(JSON.stringify(data, null, 2, '\t'));

    const user = req.user.user
    
    const front_pagination = []
    for (let index = 1; index <=data.totalPages; index++) {
        front_pagination.push({
            page: index,
            active: index == data.page
        })
    }

    // Renderizar la vista 'products' y pasar los datos y la paginación al template
    res.render('products', {data, user, front_pagination})
})

export default router
