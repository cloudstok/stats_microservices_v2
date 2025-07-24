import type { Request, Response } from "express"

export const get = async (req: Request, res: Response) => {
    return res.status(200).send({ msg: "jetx get" })
}

export const post = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "jetx post" })
}
export const update = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "jetx patch" })
}
export const del = (_: Request, res: Response) => {
    return res.status(200).send({ msg: "jetx delete" })
}
