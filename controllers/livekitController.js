import dotenv from "dotenv";
import { AccessToken, RoomServiceClient } from "livekit-server-sdk";
dotenv.config();
const { LIVEKIT_SOCKET_URL, LIVEKIT_API_KEY, LIVEKIT_SECRET_KEY } = process.env;

const tokenGenerate = async (req, res) => {
  try {
    const { roomName, participantName } = req.body;

    if (!roomName || !participantName) {
      return res
        .status(400)
        .json({ message: "roomName and participantName are required" });
    }

    const tokenGenerate = new AccessToken(
      process.env.LIVEKIT_API_KEY,
      process.env.LIVEKIT_SECRET_KEY,
      { identity: participantName, ttl: "30m" }
    );

    tokenGenerate.addGrant({
      roomJoin: true,
      room: roomName,
      roomCreate: true,
      canPublish: true,
      canSubscribe: true,
    });

    const token = await tokenGenerate.toJwt();

    res.status(200).json({ success: true, token: token });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || err });
  }
};

const sendMessage = async (req, res) => {
  const topicEnum = ["AUDIO", "VIDEO", "DISCONNECT", "CHAT"];
  try {
    const { localParticipant, userName, roomName, message, dId, topic } =
      req.body;
    if (!roomName) {
      return res.status(400).json({
        success: false,
        message: "Please provide roomName",
      });
    }
    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Please provide Message",
      });
    }
    if (!dId) {
      return res.status(400).json({
        success: false,
        message: "Please provide  destinationIdentities",
      });
    }
    if (!topic || !topicEnum?.includes(topic.toLocaleUpperCase())) {
      return res.status(400).json({
        success: false,
        message: !topicEnum?.includes(topic)
          ? `Please send this ENUM ${topicEnum.join(", ")}`
          : "Please provide  topic",
      });
    }
    const room = new RoomServiceClient(
      LIVEKIT_SOCKET_URL,
      LIVEKIT_API_KEY,
      LIVEKIT_SECRET_KEY
    );
    const encoder = new TextEncoder();
    const data = encoder.encode(
      `${localParticipant}$-${dId}$-${userName}$-${topic}$-${message}`
    );
    await room.sendData(roomName, data, 0, {
      destinationIdentities: dId,
      topic: topic,
    });
    return res.status(200).json({ success: true, message });
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message || err });
  }
};

export { sendMessage, tokenGenerate };
