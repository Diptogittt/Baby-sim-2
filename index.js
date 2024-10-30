const express = require("express");
const fs = require("fs");
const stringSimilarity = require("string-similarity");
const axios = require("axios");
const app = express();
const chokidar = require("chokidar");
const simpleGit = require("simple-git");
const git = simpleGit();
const PORT = 3000;
let isGitOperationInProgress = false;
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/dipto.html");
});
app.use(express.json());
const reactFilePath = __dirname + "/react.json";
const newReplyFilePath = __dirname + "/simsimi.json";
const defaultReplyFilePath = __dirname + "/reply.json";
const replyDirectoryPath = __dirname + "/replies/";
const senderFilePath = __dirname + "/sender.json";
const teacher = __dirname + "/teacher.json";
const badwords = __dirname + "/badwords.json";
const nonTeach = __dirname + "/nonTeach2.json";
if (!fs.existsSync(replyDirectoryPath)) {
  fs.mkdirSync(replyDirectoryPath);
}
const fontMaps = {
  1: {
    a: "𝗮",
    b: "𝗯",
    c: "𝗰",
    d: "𝗱",
    e: "𝗲",
    f: "𝗳",
    g: "𝗴",
    h: "𝗵",
    i: "𝗶",
    j: "𝗷",
    k: "𝗸",
    l: "𝗹",
    m: "𝗺",
    n: "𝗻",
    o: "𝗼",
    p: "𝗽",
    q: "𝗾",
    r: "𝗿",
    s: "𝘀",
    t: "𝘁",
    u: "𝘂",
    v: "𝘃",
    w: "𝘄",
    x: "𝘅",
    y: "𝘆",
    z: "𝘇",
    A: "𝗔",
    B: "𝗕",
    C: "𝗖",
    D: "𝗗",
    E: "𝗘",
    F: "𝗙",
    G: "𝗚",
    H: "𝗛",
    I: "𝗜",
    J: "𝗝",
    K: "𝗞",
    L: "𝗟",
    M: "𝗠",
    N: "𝗡",
    O: "𝗢",
    P: "𝗣",
    Q: "𝗤",
    R: "𝗥",
    S: "𝗦",
    T: "𝗧",
    U: "𝗨",
    V: "𝗩",
    W: "𝗪",
    X: "𝗫",
    Y: "𝗬",
    Z: "𝗭",
    0: "𝟬",
    1: "𝟭",
    2: "𝟮",
    3: "𝟯",
    4: "𝟰",
    5: "𝟱",
    6: "𝟲",
    7: "𝟳",
    8: "𝟴",
    9: "𝟵",
    "?": "?",
    "!": "!",
  },
  2: {
    a: "𝚊",
    b: "𝚋",
    c: "𝚌",
    d: "𝚍",
    e: "𝚎",
    f: "𝚏",
    g: "𝚐",
    h: "𝚑",
    i: "𝚒",
    j: "𝚓",
    k: "𝚔",
    l: "𝚕",
    m: "𝚖",
    n: "𝚗",
    o: "𝚘",
    p: "𝚙",
    q: "𝚚",
    r: "𝚛",
    s: "𝚜",
    t: "𝚝",
    u: "𝚞",
    v: "𝚟",
    w: "𝚠",
    x: "𝚡",
    y: "𝚢",
    z: "𝚣",
    A: "𝙰",
    B: "𝙱",
    C: "𝙲",
    D: "𝙳",
    E: "𝙴",
    F: "𝙵",
    G: "𝙶",
    H: "𝙷",
    I: "𝙸",
    J: "𝙹",
    K: "𝙺",
    L: "𝙻",
    M: "𝙼",
    N: "𝙽",
    O: "𝙾",
    P: "𝙿",
    Q: "𝚀",
    R: "𝚁",
    S: "𝚂",
    T: "𝚃",
    U: "𝚄",
    V: "𝚅",
    W: "𝚆",
    X: "𝚇",
    Y: "𝚈",
    Z: "𝚉",
    0: "𝟶",
    1: "𝟷",
    2: "𝟸",
    3: "𝟹",
    4: "𝟺",
    5: "𝟻",
    6: "𝟼",
    7: "𝟽",
    8: "𝟾",
    9: "𝟿",
    "?": "?",
    "!": "!",
  },
  3: {
    a: "𝙖",
    b: "𝙗",
    c: "𝙘",
    d: "𝙙",
    e: "𝙚",
    f: "𝙛",
    g: "𝙜",
    h: "𝙝",
    i: "𝙞",
    j: "𝙟",
    k: "𝙠",
    l: "𝙡",
    m: "𝙢",
    n: "𝙣",
    o: "𝙤",
    p: "𝙥",
    q: "𝙦",
    r: "𝙧",
    s: "𝙨",
    t: "𝙩",
    u: "𝙪",
    v: "𝙫",
    w: "𝙬",
    x: "𝙭",
    y: "𝙮",
    z: "𝙯",
    A: "𝘼",
    B: "𝘽",
    C: "𝘾",
    D: "𝘿",
    E: "𝙀",
    F: "𝙁",
    G: "𝙂",
    H: "𝙃",
    I: "𝙄",
    J: "𝙅",
    K: "𝙆",
    L: "𝙇",
    M: "𝙈",
    N: "𝙉",
    O: "𝙊",
    P: "𝙋",
    Q: "𝙌",
    R: "𝙍",
    S: "𝙎",
    T: "𝙏",
    U: "𝙐",
    V: "𝙑",
    W: "𝙒",
    X: "𝙓",
    Y: "𝙔",
    Z: "𝙕",
    0: "𝟬",
    1: "𝟭",
    2: "𝟮",
    3: "𝟯",
    4: "𝟰",
    5: "𝟱",
    6: "𝟲",
    7: "𝟳",
    8: "𝟴",
    9: "𝟵",
    "?": "?",
    "!": "!",
  },
  4: {
    a: "𝘼",
    b: "𝘽",
    c: "𝘾",
    d: "𝘿",
    e: "𝙀",
    f: "𝙁",
    g: "𝙂",
    h: "𝙃",
    i: "𝙄",
    j: "𝙅",
    k: "𝙆",
    l: "𝙇",
    m: "𝙈",
    n: "𝙉",
    o: "𝙊",
    p: "𝙋",
    q: "𝙌",
    r: "𝙍",
    s: "𝙎",
    t: "𝙏",
    u: "𝙐",
    v: "𝙑",
    w: "𝙒",
    x: "𝙓",
    y: "𝙔",
    z: "𝙕",
    A: "𝙖",
    B: "𝙗",
    C: "𝙘",
    D: "𝙙",
    E: "𝙚",
    F: "𝙛",
    G: "𝙜",
    H: "𝙝",
    I: "𝙞",
    J: "𝙟",
    K: "𝙠",
    L: "𝙡",
    M: "𝙢",
    N: "𝙣",
    O: "𝙤",
    P: "𝙥",
    Q: "𝙦",
    R: "𝙧",
    S: "𝙨",
    T: "𝙩",
    U: "𝙪",
    V: "𝙫",
    W: "𝙬",
    X: "𝙭",
    Y: "𝙮",
    Z: "𝙯",
    0: "𝟎",
    1: "𝟏",
    2: "𝟐",
    3: "𝟑",
    4: "𝟒",
    5: "𝟓",
    6: "𝟔",
    7: "𝟕",
    8: "𝟖",
    9: "𝟗",
    "?": "?",
    "!": "!",
  },
};
function textToStyled(text, fontMap) {
  return text
    .split("")
    .map((char) => fontMap[char])
    .join("");
}
function getReplyFilePath(language) {
  return language
    ? `${replyDirectoryPath}${language}.json`
    : defaultReplyFilePath;
}

function readReplies(language) {
  const filePath = getReplyFilePath(language);
  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath);
    return JSON.parse(data);
  } else {
    return {};
  }
}
function writeReplies(replies, language) {
  const filePath = getReplyFilePath(language);
  fs.writeFileSync(filePath, JSON.stringify(replies, null, 4));
}

function readSenders() {
  if (fs.existsSync(senderFilePath)) {
    const data = fs.readFileSync(senderFilePath);
    return JSON.parse(data);
  } else {
    return {};
  }
}

function writeSenders(senders) {
  fs.writeFileSync(senderFilePath, JSON.stringify(senders, null, 4));
}

function addSenderID(senderID, name) {
  let senderData = readSenders();
  senderData[senderID] = name;
  writeSenders(senderData);
}

function getRandomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function contains18Plus(teach = "", reply = "", action = "", words = "") {
  if (!fs.existsSync(badwords)) {
    fs.writeFileSync(
      badwords,
      JSON.stringify([
        "18+",
        "hda",
        "xuda",
        "adult",
        "explicit",
        "mature",
        "sex",
        "mc",
        "chuden",
        "chuda",
        "fuck",
        "magi",
        "bessha",
        "chudte",
        "nunu",
        "voda",
        "xhudi",
        "xudi",
        "chudi",
        "dhon",
        "vara",
        "khanki",
        "magi",
        "kuttar baccha",
        "bara",
        "gud",
        "putki",
        "lawra",
        "pussy",
        "dick",
        "bainchod",
      ])
    );
  }
  const data = fs.readFileSync(badwords, "utf8");
  let forbiddenWords = JSON.parse(data);
  if (action === "add") {
    const wordsToAdd = words
      .split(",")
      .map((word) => word.trim().toLowerCase());
    forbiddenWords.push(
      ...wordsToAdd.filter((word) => word && !forbiddenWords.includes(word))
    );
    fs.writeFileSync(badwords, JSON.stringify(forbiddenWords, null, 4));
    return "✅ | BadWords added";
  }

  if (action === "remove") {
    // let forbiddenWords = []
    const wordsToRemove = words
      .split(",")
      .map((word) => word.trim().toLowerCase());

    forbiddenWords = forbiddenWords.filter(
      (word) => !wordsToRemove.includes(word)
    );

    fs.writeFileSync(badwords, JSON.stringify(forbiddenWords, null, 4));
    return "✅ | BadWords removed";
  }
  if (action === "list") {
    return forbiddenWords;
  }
  return forbiddenWords.some(
    (word) =>
      teach.toLowerCase().includes(word) || reply.toLowerCase().includes(word)
  );
}
async function ownTeach(text) {
  try {
    const { data } = await axios.post(
      "https://api.simsimi.vn/v1/simtalk",
      new URLSearchParams({
        text: `${text}`,
        lc: "bn",
      })
    );
    const newSim = data.message;
    console.log(newSim);
    if (!fs.existsSync(newReplyFilePath)) {
      fs.writeFileSync(newReplyFilePath, JSON.stringify({}, null, 4));
    }

    const newReplies = JSON.parse(fs.readFileSync(newReplyFilePath));
    if (!newReplies[text]) {
      newReplies[text] = [];
    }
    newReplies[text].push(newSim);
    fs.writeFileSync(newReplyFilePath, JSON.stringify(newReplies, null, 4));

    return newSim;
  } catch (error) {
    console.error("Error fetching from Simsimi API:", error);
    return null;
  }
}
function readReacts() {
  if (!fs.existsSync(reactFilePath)) {
    fs.writeFileSync(reactFilePath, JSON.stringify({}, null, 4));
  } else if (fs.existsSync(reactFilePath)) {
    const data = fs.readFileSync(reactFilePath);
    return JSON.parse(data);
  } else {
    return {};
  }
}

function writeReacts(reacts) {
  fs.writeFileSync(reactFilePath, JSON.stringify(reacts, null, 4));
}
function removeTextFromReplies(replies, textToRemove) {
  const updatedReplies = {};

  for (const key in replies) {
    if (key !== textToRemove) {
      const updatedResponses = replies[key].filter(
        (response) => response !== textToRemove
      );
      if (updatedResponses.length > 0) {
        updatedReplies[key] = updatedResponses;
      }
    }
  }

  for (const key in updatedReplies) {
    if (Array.isArray(updatedReplies[key])) {
      updatedReplies[key] = updatedReplies[key]
        .map((item) => {
          if (typeof item === "object") {
            return removeTextFromReplies(item, textToRemove);
          }
          return item;
        })
        .filter(Boolean);
    }
  }

  return updatedReplies;
}
let numberData = {};

function teacherName(number) {
  try {
    if (fs.existsSync(teacher)) {
      const data = fs.readFileSync(teacher, "utf8");
      numberData = JSON.parse(data);
    } else {
      fs.writeFileSync(teacher, JSON.stringify({}, null, 4));
    }

    if (numberData[number]) {
      numberData[number]++;
    } else {
      numberData[number] = 1;
    }
    fs.writeFileSync(teacher, JSON.stringify(numberData, null, 4));
  } catch (err) {
    console.error("Error in teacherName function:", err);
  }

  return numberData[number];
}
app.get("/dipto", async (req, res) => {
  const text = req.query.text;
  const editText = req.query.edit;
  const replaceText = req.query.replace;
  const teachText = req.query.teach;
  const reply = req.query.reply;
  const senderID = req.query.senderID;
  const listText = req.query.list;
  const removeAllText = req.query.removeAll;
  const textToRemove = req.query.remove;
  let indexToRemove = req.query.index;
  const language = req.query.language;
  const font = parseInt(req.query.font);
  const react = req.query.react;
  const key = req.query.key;
  const bad = req.query.badWords;
  const bbad = req.query.rmBadWords;
  const bbaad = req.query.listBadWords;
  const find = req.query.find;
  let replies = readReplies(language);
  let reacts = readReacts();
  //try {
  if (bad) {
    const t = "j";
    const y = "r";
    const z = "add";
    const badd = await contains18Plus(t, y, z, bad);
    return res.status(201).json({
      status: "success",
      message: badd,
    });
  }
  if (bbad) {
    const t = "j";
    const y = "r";
    const z = "remove";
    const badd = await contains18Plus(t, y, z, bad);
    return res.status(201).json({
      status: "success",
      message: badd,
    });
  }
  if (bbaad) {
    const t = "j";
    const y = "r";
    const z = "list";
    const badd = await contains18Plus(t, y, z, bad);
    return res.status(201).json({
      status: "success",
      message: badd,
    });
  }
  if (editText && replaceText) {
    if (replies[editText]) {
      replies[replaceText] = replies[editText];
      delete replies[editText];
      writeReplies(replies, language);
      return res.json({
        success: true,
        message: `Replaced '${editText}' into '${replaceText}'.`,
      });
    } else {
      return res
        .status(404)
        .json({ error: "No reply found for the given text." });
    }
  }

  if (teachText && reply && senderID && !key) {
    if (contains18Plus(teachText, reply)) {
      return res.json({
        message: "Teaching 18+ content is not allowed ❌.",
        teacher: `${senderID}`,
        teachs: `null`,
      });
    }
    if (!replies[teachText]) {
      replies[teachText] = [];
    }
    replies[teachText].push(...reply.split(","));
    writeReplies(replies, language);
    const tt = await teacherName(senderID);
    return res.json({
      success: true,
      message: `Replies "${reply}" added to "${teachText}".`,
      teacher: `${senderID}`,
      teachs: `${tt}`,
      teachNumber: `${Object.keys(replies).length}`,
    });
  } else if (teachText && senderID && reply && key) {
    addSenderID(senderID, reply);
    return res.json({
      success: true,
      message: `Replies "${reply}" added to "${teachText}".`,
    });
  } else if (teachText && react && !reply && !senderID) {
    if (!reacts[teachText]) {
      reacts[teachText] = [];
    }
    reacts[teachText].push(react);
    writeReacts(reacts);
    return res.json({
      success: true,
      message: `Reaction "${react}" added to "${teachText}".`,
    });
  }
  if (listText) {
    if (listText === "all") {
      const data = fs.readFileSync(teacher, "utf8");
      const jsonObject = JSON.parse(data);
      const teacherList = Object.entries(jsonObject).map(([key, value]) => ({
        [key]: value,
      }));
      return res.json({
        teacher: { teacherList },
        length: Object.keys(replies).length,
      });
    } else if (replies[listText]) {
      return res.json({ data: replies[listText] });
    } else {
      return res.json({ data: "not found maybe self teached" });
    }
  }

  if (removeAllText) {
    replies = {};
    writeReplies(replies, language);
    return res.json({ success: true, message: "Removed all replies." });
  }

  /* if (textToRemove && !indexToRemove) {
    if (replies[textToRemove]) {
      delete replies[textToRemove];
      writeReplies(replies, language);
      return res.json({
        success: true,
        message: `Removed '${textToRemove}' from replies.`,
      });
    } else {
      return res
        .status(404)
        .json({ error: "No reply found for the given text." });
    }
  }*/
  if (textToRemove && !indexToRemove) {
    const updatedReplies = removeTextFromReplies(replies, textToRemove);
    writeReplies(updatedReplies, language);
    return res.json({
      success: true,
      message: `Removed '${textToRemove}' from all replies and keys.`,
    });
  }
  /////
  if (textToRemove && indexToRemove && !isNaN(parseInt(indexToRemove))) {
    indexToRemove = parseInt(indexToRemove) - 1;
    if (replies[textToRemove]) {
      if (indexToRemove >= 0 && indexToRemove < replies[textToRemove].length) {
        replies[textToRemove].splice(indexToRemove, 1);
        if (replies[textToRemove].length === 0) {
          delete replies[textToRemove];
        }
        writeReplies(replies, language);
        return res.json({
          success: true,
          message: `Removed reply at index ${
            indexToRemove + 1
          } from '${textToRemove}'.`,
        });
      } else {
        return res
          .status(404)
          .json({ error: "Index out of range for the given text." });
      }
    } else {
      return res
        .status(404)
        .json({ error: "No reply found for the given text." });
    }
  }

  const emoji = [
    "🤗",
    "🌚",
    "🐥",
    "😑",
    "👋",
    "🐸",
    "🐐",
    "🧑‍🍼",
    "🫡",
    "😘",
    "🫶🏻",
    "🫰",
    "🚶",
    "🐤",
    "🐤🐤",
    "👋👋",
    "😴",
    "😴😴",
    "🥳",
    "🥳🥳",
    "🥴",
    "😦",
    "😒😒",
    "😒",
    "😏",
    "😼",
    "😵‍💫",
    "🩵🩵",
    "❤️‍🩹",
    "😡",
    "😾",
    "🤦",
    "😛",
    "🤷",
    "😆",
    "🙂",
    "⛹️",
    "😟",
    "🦆",
"🤠","👽","😎","😗","😚","😃","😀","🤒","🌝","👀"
  ];

  if (text) {
    try {
      let senderData = readSenders();
      if (senderID && senderData[senderID]) {
        return res.json({
          reply: "Tumi bolaso tomar name😒 " + senderData[senderID],
        });
      } else if (senderID && !senderData[senderID]) {
        return res.json({ reply: "Jani na .karon tumi tumar name bolo nai😒" });
      }

      const textLowerCase = text.toLowerCase();
      const keys = Object.keys(replies);

      // Use string-similarity to find the best match
      let matchedKey;
      let bestMatch = stringSimilarity.findBestMatch(textLowerCase, keys);

      if (bestMatch.bestMatch.rating > 0.5) {
        // Threshold for a good match
        matchedKey = bestMatch.bestMatch.target;
      } else {
        matchedKey = keys.find((key) =>
  textLowerCase.startsWith(key.toLowerCase())
        );
      }
      
      if (matchedKey) {
        const randomReply = getRandomElement(replies[matchedKey]);
        let replyWithEmoji;
        if (typeof font === 'number' && !isNaN(font)){
          const fontMap = fontMaps[font];
          const styledReply = textToStyled(randomReply, fontMap);
          replyWithEmoji = styledReply;
        } else {
          replyWithEmoji = randomReply;
        }
         const randomEmoji = getRandomElement(emoji);
        replyWithEmoji += randomEmoji;
        if (reacts[matchedKey]) {
          const randomReact = getRandomElement(reacts[matchedKey]);
          return res.json({ reply: replyWithEmoji, react: randomReact });
        } else {
          return res.json({ reply: replyWithEmoji });
        }
      } else {
        let nonTeached = {};
        try {
          const existingData = fs.readFileSync(nonTeach, "utf8");
          nonTeached = JSON.parse(existingData);
        } catch (readError) {
          console.log(readError)
          res.send("Error reading nonTeach file:");
        }

        nonTeached[text] = `["non"]`;
        fs.writeFileSync(nonTeach, JSON.stringify(nonTeached, null, 4));

        return res.json({
     reply: "Please teach this sentence <🥺",
        }); /*
       const newData = await ownTeach(textLowerCase);
        const styledReply = textToStyled(newData, fontMap);
        const randomEmoji = getRandomElement(emoji);
        const replyWithEmoji = styledReply + randomEmoji;
        return res.json({ reply: replyWithEmoji });*/
      }
    } catch (error) {
      console.log(error);
      let nonTeached = {};
      try {
        const existingData = fs.readFileSync(nonTeach, "utf8");
        nonTeached = JSON.parse(existingData);
      } catch (readError) {
        res.send("Error reading nonTeach file:", readError);
      }

      nonTeached[text] = `["non"]`;
      fs.writeFileSync(nonTeach, JSON.stringify(nonTeached, null, 4));

      return res.json({
        reply: "𝗦𝗼𝗿𝗿𝘆 𝗕𝗮𝗯𝘆 𝗮𝗺𝗮𝗸𝗲 𝗮𝘁𝗮 𝗧𝗲𝗮𝗰𝗵 𝗸𝗼𝗿𝗮 𝗵𝗼𝗶 𝗻𝗶 <🥺",
      });
    }
  }
  if (find) {
    const result = {};
    for (const [replyKey, values] of Object.entries(replies)) {
      if (
        replyKey.split(/\s+/).includes(find) ||
        values.some((value) => {
          if (typeof value === "string") {
            return value.split(/\s+/).includes(find);
          }
          return false;
        })
      ) {
        result[replyKey] = values;
      }
    }
    if (Object.keys(result).length === 0) {
      return res.json({
        message: "Not found message , It's self teached",
        author: "亗ㅤƊᎥᎮㅤƬᴏㅤ亗",
      });
    }
    return res.json({ result, author: "亗ㅤƊᎥᎮㅤƬᴏㅤ亗" });
  }

  return res.json({
    reply: "𝗦𝗼𝗿𝗿𝘆 𝗕𝗮𝗯𝘆 𝗮𝗺𝗮𝗸𝗲 𝗮𝘁𝗮 𝗧𝗲𝗮𝗰𝗵 𝗸𝗼𝗿𝗮 𝗵𝗼𝗶 𝗻𝗶 <🥺🥹🥹",
  });
  /*  }catch (error) {
  return res.status(400).json({ 
  err: "Invalid request parameters.", error
  });
 console.log(error);
}*/
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

const watcher = chokidar.watch(".", {
  ignored: /node_modules|\.git/,
  persistent: true,
});

// Define what to do on change
const onChange = async (path) => {
  console.log(`File ${path} has been changed`);

  if (isGitOperationInProgress) {
    console.log("Git operation already in progress, skipping...");
    return;
  }

  isGitOperationInProgress = true;

  try {
    await git.add(".");
    await git.commit("Auto-commit");
    await git.push();
    console.log("Changes pushed to GitHub");
  } catch (error) {
    console.error("Error during Git operations", error);
  } finally {
    isGitOperationInProgress = false;
  }
};

// Add event listeners.
watcher.on("change", onChange).on("add", onChange).on("unlink", onChange);

console.log("Watching for the next file changes...");
