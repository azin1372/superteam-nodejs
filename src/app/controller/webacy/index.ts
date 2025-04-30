import { Request, Response } from "express";
import axios from "axios";
import { urlJoinP } from 'url-join-ts';
import { WebacyConfig } from "../../../config/webacy.js";
import Cache from "../../models/cache.js";
import { AppConfig } from "../../../config/app.js";

export const getThreatConsiderations = async (req: Request, res: Response) => {
    try {

        const address = req.params.address ? String(req.params.address).trim() : "";
        if (!address || address.length <= 10) {
            res.status(400).json({
                message: "Address is required"
            });
            return;
        }

        const cachedData = await Cache.findOne({
            section: "webacy",
            key: address
        });

        if (cachedData) {
            const isCacheValid = Date.now() - new Date(cachedData.createdAt).getTime() < AppConfig.cache_duration_in_sec * 1000;
            console.log({ isCacheValid })
            if (isCacheValid) {
                res.json({
                    data: cachedData.data
                });
                return
            }
        }


        const data = await axios.get(urlJoinP(WebacyConfig.baseUrl, ["addresses", address]), {
            headers: {
                "x-api-key": WebacyConfig.token,
                "Accept": "application/json",
                "Content-Type": "application/json"
            }
        })

        //* Save to Cache (Async)
        Cache.create({
            section: "webacy",
            key: address,
            data: data.data,
            createdAt: new Date()
        }).then(() => {
            //
        }).catch(() => {
            //
        });

        res.json({
            data: data.data
        });
        return;


    } catch (e: any) {

        if (typeof e === "object" && e?.response?.data?.message) {
            res.status(400).send({
                message: e?.response?.data?.message,
                reason: e
            });
            return
        }
        res.status(500).send({
            message: "Something went wrong",
            reason: e
        })
    }
}