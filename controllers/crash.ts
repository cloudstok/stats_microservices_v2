import type { Request, Response } from "express"

export const get = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "crash get" })
}
export const post = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "crash post" })
}
export const update = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "crash patch" })
}
export const del = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "crash delete" })
}
