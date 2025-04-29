import { Request, Response } from "express";
import Cache from "../../models/cache.js";
import { AppConfig } from "../../../config/app.js";
import { TokenData } from "../../services/tokenData.js";

export const MakeTokenData = async (req: Request, res: Response) => {
  try {
    const address = req.params.address ? String(req.params.address).trim() : "";
    if (!address || address.length <= 10) {
      res.status(400).json({
        message: "Address is required",
      });
      return;
    }


    const cachedData = await Cache.findOne({
      section: "coingecko",
      key: address,
    });

    if (cachedData) {
      console.log("sssssssssssssss 11")
      const isCacheValid = Date.now() - new Date(cachedData.createdAt).getTime() < AppConfig.cache_duration_in_sec * 1000;
      console.log("sssssssssssssss 22")
      if (isCacheValid) {
        console.log("sssssssssssssss 33")
        res.json({
          data: cachedData.data,
        });
        return;
      }
    }
    console.log("sssssssssssssss 44")

    const token_data = new TokenData(address);
    const data = await token_data.getDataFromCoingecko(true);
    if (!data.success) {
      res.status(400).send({ message: data.message });
      return;
    }


    Cache.create({
      section: "coingecko",
      key: address,
      data: data?.data,
      createdAt: new Date(),
    })
      .then(() => {
        //
      })
      .catch(() => {
        //
      });


    res.send({
      data: data?.data,
    });

    return;
  } catch (e: any) {
    if (typeof e === "object" && e?.response?.data?.message) {
      res.status(400).send({
        message: e?.response?.data?.message,
        reason: e,
      });
      return;
    }
    res.status(500).send({
      message: "Something went wrong",
      reason: e,
    });
  }
};
