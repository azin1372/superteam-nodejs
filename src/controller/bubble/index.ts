import { Request, Response } from "express";
import Cache from "../../models/cache.js";
import { AppConfig } from "../../../config/app.js";
import { takeScreenshot } from "../../services/screenshot.js";

export const GetBubbleMap = async (req: Request, res: Response) => {
    try {
        const address = req.params.address ? String(req.params.address).trim() : "";
        if (!address || address.length <= 10) {
            res.status(400).json({
                message: "Address is required"
            });
            return;
        }

        const cachedData = await Cache.findOne({
            section: "bubble_map",
            key: address
        });
        
        if (cachedData) {
            const isCacheValid = Date.now() - new Date(cachedData.createdAt).getTime() < AppConfig.cache_duration_in_sec * 1000;
            if (isCacheValid) {
                res.json({
                    data: cachedData.data
                });
                return
            }
        }


        const screen_shot_string_base64 = await takeScreenshot(address);

        if (screen_shot_string_base64) {
            Cache.create({
                section: "bubble_map",
                key: address,
                data: screen_shot_string_base64,
                createdAt: new Date()
            }).then(() => {
                //
            }).catch(() => {
                //
            });
        }


        res.send({
            data: screen_shot_string_base64
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