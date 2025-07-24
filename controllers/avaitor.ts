import type { Request, Response } from "express"

export const get = (_: Request, res: Response) => {
    return res.status(200).send()
}
export const post = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "avaitor post" })
}
export const update = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "avaitor patch" })
}
export const del = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "avaitor delete" })
}
