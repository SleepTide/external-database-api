import express, { Application } from "express";
import Filesystem from "../Utils/Filesystem/Filesystem";
import Logger from "../Utils/Logger/Logger";
import Member from "../Utils/Database/Schemas/Member";

export enum HTTPCodes {
  OK = 200,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  INTERNAL_ERROR = 500,
}
export type Member = {
  entity_id: string;
  username: string;
};

export default class API {
  public static Server: Application;

  constructor() {
    this.Start();
  }

  private async Start(): Promise<void> {
    const config = Filesystem.ReadConfig();

    API.Server = express();

    this.Init();

    API.Server.listen(config.port, config.host, (error) => {
      if (error) {
        Logger.Error("Failed to start server:", error);
        process.exit(1);
      }

      Logger.Info(`API has started on http://${config.host}:${config.port}/`);
      return;
    });
  }
  private Init(): void {
    API.Server.use(express.json());

    this.StatusEndpoints();
    this.MemberEndpoints();

    return;
  }

  private StatusEndpoints(): void {
    API.Server.post("/status/", (req, res) => {
      Logger.Debug(req.body, req.ip);

      res.sendStatus(HTTPCodes.OK);

      return;
    });

    return;
  }
  private MemberEndpoints(): void {
    API.Server.post("/members/create/", async (req, res) => {
      const body: Member = req.body;

      if (!body.entity_id || !body.username) {
        res.status(HTTPCodes.BAD_REQUEST).send({
          message: "Missing required fields!",
        });
        return;
      }

      const member = new Member(body);

      await member.save();

      res.status(HTTPCodes.OK).send({ message: "Created Member!" });
      return;
    });
    API.Server.post("/members/delete/:entity_id/", async (req, res) => {
      const entity_id = req.params.entity_id;
      const member = await Member.findOne({ entity_id });

      if (!member) {
        res.status(HTTPCodes.NOT_FOUND).send({
          message: "Member not found!",
        });
        return;
      }

      await Member.deleteOne({ _id: member._id });

      res.status(HTTPCodes.OK).send({
        message: "Member deleted!",
      });
      return;
    });
    API.Server.post("/members/search/", async (req, res) => {
      const body = req.body;

      if (!body.username) {
        res.status(HTTPCodes.BAD_REQUEST).send({
          message: "Missing username!",
        });
      }

      const member = await Member.findOne({ username: body.username });

      if (!member) {
        res.status(HTTPCodes.NOT_FOUND).send({
          message: "Member does not exist!",
        });
        return;
      }

      res.status(HTTPCodes.OK).send({ member });
      return;
    });
    API.Server.get("/members/get/:entity_id/", async (req, res) => {
      const entity_id = req.params.entity_id;

      const member = await Member.findOne({ entity_id });

      if (!member) {
        res.status(HTTPCodes.NOT_FOUND).send({
          message: "Member not found!",
        });
        return;
      }

      res.status(HTTPCodes.OK).send({ member });
      return;
    });
  }
}
