// 所有谜题数据和文案，方便后续修改

export const OPENING = {
  title: "第 23 次许愿",
  subtitle: "一场只属于你的定制线上密室逃脱。",
  intro: [
    "欢迎来到密室入口！本密室共三间房间。",
    "请在房间内耐心寻找线索、专心解密，解锁惊喜吧！",
    "电脑端体验最佳，游玩时长约 15 分钟。",
    "你准备好了吗？",
  ],
  enterCta: "进入密室",
};

// 章节过场页文案
export const CHAPTERS = [
  {
    title: "我们，在世界的两端",
    intro:
      "一个在伦敦的清晨 5 点 20 分，一个在北京的午后 2 点 20 分。\n中间隔着 7 小时，和一句没说出口的「想你」。",
    cta: "推开门 →",
  },
  {
    title: "礼物档案室",
    intro:
      "这间私人小展览，收着我偷偷送过、藏着没送的那些小东西。\n每一件都标了日期。",
    cta: "走进展览 →",
  },
  {
    title: "未来的一日行程单",
    intro:
      "一张白色的桌子，摆着我们下次见面的全部计划：\n机票、面、咖啡、和一只暗着的许愿瓶。",
    cta: "打开行程单 →",
  },
] as const;

export type Hotspot = {
  id: string;
  label: string;
  x: number; // %
  y: number; // %
  icon: string;
  clueTitle: string;
  clueText: string;
};

export type RoomConfig = {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  ambient: string;
  hotspots: Hotspot[];
  puzzlePrompt: string;
  puzzleHint: string;
  answer: string;
  /** 按尝试次数返回错误提示（数组最后一项作为后续兜底） */
  errorMessages?: string[];
  successText: string;
  nextCta: string;
};

// ===== 房间 1：我们，在世界的两端 =====
// 三个数字：520 + 1420 + 912 = 2852
const ROOM_1: RoomConfig = {
  id: "room1",
  index: 1,
  name: "我们，在世界的两端",
  subtitle: "时差 · 想念 · 一句没说出口的话",
  ambient:
    "左边是你在伦敦的小公寓，右边是我的工位和健身房，中间一条长廊把两个时区连在一起。",
  hotspots: [
    {
      id: "pc-left",
      label: "你的笔记本",
      x: 18,
      y: 58,
      icon: "💻",
      clueTitle: "你的电脑亮了一下",
      clueText:
        "锁屏时间：05:20\n壁纸是我们去年夏天在海边那张照片。",
    },
    {
      id: "pc-right",
      label: "我的台式机",
      x: 70,
      y: 50,
      icon: "🖥️",
      clueTitle: "我的电脑亮了一下",
      clueText:
        "锁屏时间：14:20\n旁边一排 Labubu 正盯着屏幕，假装在加班。",
    },
    {
      id: "calendar",
      label: "走廊尽头的日历",
      x: 50,
      y: 18,
      icon: "📅",
      clueTitle: "墙上的那本日历",
      clueText:
        "翻到这一页，有一格被红色马克笔画了一个大大的爱心 ❤️。\n你应该知道是哪一天吧——那天我们认识的。",
    },
  ],
  puzzlePrompt: "把这三个数字按顺序加起来，得到四位密码：",
  puzzleHint:
    "电脑1 → 电脑2 → 日历上爱心那天（写成 4 位数字，月+日，例如 09 月 12 日 = 912）。",
  answer: "2852",
  errorMessages: [
    "密码不对哦，再猜猜看三个数字之间是什么关系～",
    "这是一道你高中最擅长的学科的问题，很简单，再试试吧～",
  ],
  successText:
    "门锁咔哒一声打开了。\n原来世界两端的时间，也可以被算进同一个答案里。",
  nextCta: "进入下一章",
};

export const ROOMS: RoomConfig[] = [
  ROOM_1,
  // 房间 2 的元数据（详细数据见下方 ROOM_2_DATA，Room2 组件单独渲染）
  {
    id: "room2",
    index: 2,
    name: "礼物档案室",
    subtitle: "那些我偷偷送过的小东西",
    ambient: "",
    hotspots: [],
    puzzlePrompt: "",
    puzzleHint: "",
    answer: "",
    successText: "",
    nextCta: "进入未来的一日行程单",
  },
  // 房间 3 元数据（详细数据见下方 ROOM_3_DATA）
  {
    id: "room3",
    index: 3,
    name: "未来的一日行程单",
    subtitle: "把约定拆成五片，装进同一只许愿瓶",
    ambient: "",
    hotspots: [],
    puzzlePrompt: "",
    puzzleHint: "",
    answer: "",
    successText: "",
    nextCta: "进入结算页",
  },
];

export const FINALE = {
  letterTitle: "写给你的信",
  letter: [
    "亲爱的小寿星：",
    "",
    "23 岁快乐。",
    "过去这一年，你比自己想象的更勇敢，也比我嘴上说的更可爱。",
    "我没办法把所有想说的塞进一个礼物盒，",
    "所以做了这个小小的房间，让你一个人慢慢逛。",
    "",
    "如果累了，就回到这里。",
    "灯一直会亮着。",
    "",
    "—— 永远是你的，小毛子",
  ],
  giftHint: "桌上有一个礼物盒，点它。",
  giftReveal: "（盒子里是一张纸条：「真正的礼物，下次见面亲手给你。」）",
  cakeHint: "蛋糕上有 23 根蜡烛，点一下吹灭它们。",
  wishPrompt: "第 23 次许愿——把今年最想要的那个愿望，写在这里：",
  wishPlaceholder: "在这里写下你的愿望……（只有你和我知道）",
  finalText:
    "愿望已经收到了。\n剩下的，交给我和这一整年。\n生日快乐，我的人。",
};

export const MAX_WRONG_HINT = 3;

// ===== 房间 2：礼物档案室 =====
import e1Img from "@/assets/room2/e1.png";
import e2Img from "@/assets/room2/e2.png";
import e3Img from "@/assets/room2/e3.png";
import e4Img from "@/assets/room2/e4.png";
import e5Img from "@/assets/room2/e5.png";
import e6Img from "@/assets/room2/e6.png";
import e7Img from "@/assets/room2/e7.png";
import e8Img from "@/assets/room2/e8.png";
import e9Img from "@/assets/room2/e9.png";
import e10Img from "@/assets/room2/e10.png";

export type Exhibit = {
  id: string; // "e1" ~ "e10"
  no: number;
  name: string;
  icon: string;
  desc: string;
  image: string;
};

export const ROOM_2_DATA = {
  meta: {
    index: 2,
    total: 3,
    name: "礼物档案室",
    subtitle: "把这些年送过的小东西，按时间归档",
    ambient:
      "推开门，是一间小小的私人展览馆。十个展柜沿着墙顺时针绕一圈，每一件都被仔细摆过。",
  },
  exhibits: [
    { id: "e1", no: 1, name: "护肤套盒", icon: "🧖‍♀️", desc: "做好皮肤管理。", image: e1Img },
    { id: "e2", no: 2, name: "宝矿力", icon: "🧴", desc: "好喝小甜水。", image: e2Img },
    { id: "e3", no: 3, name: "ON 金标蛋白粉", icon: "🥛", desc: "第一次知道这家伙这么贵。", image: e3Img },
    { id: "e4", no: 4, name: "电动牙刷", icon: "🪥", desc: "不用还给我。", image: e4Img },
    { id: "e5", no: 5, name: "乐高法拉利", icon: "🏎️", desc: "我也想要。", image: e5Img },
    { id: "e6", no: 6, name: "Kangol 斜挎包", icon: "👜", desc: "薄荷绿的斜挎包，好久都没有出场了呢……", image: e6Img },
    { id: "e7", no: 7, name: "lululemon T 恤", icon: "👕", desc: "怎么已经淘汰给爸爸了？", image: e7Img },
    { id: "e8", no: 8, name: "Seven Seas Omega-3 鱼油", icon: "🐟", desc: "漂洋过海来见你……", image: e8Img },
    { id: "e9", no: 9, name: "宝格丽大吉岭茶香水", icon: "🌸", desc: "香香的！", image: e9Img },
    { id: "e10", no: 10, name: "AirPods", icon: "🎧", desc: "保持耳机干净！保持耳道干燥！", image: e10Img },
  ] as Exhibit[],

  // 候选池：10 件礼物（每次进入随机抽 5 件参与排序）
  sortablePool: ["e1", "e2", "e3", "e4", "e5", "e6", "e7", "e8", "e9", "e10"],
  // 10 件礼物完整的正确时间顺序（早 → 晚）：2,6,1,4,10,9,7,3,8,5
  correctOrder: ["e2", "e6", "e1", "e4", "e10", "e9", "e7", "e3", "e8", "e5"],
  slotLabels: ["①", "②", "③", "④", "⑤"],

  puzzlePrompt:
    "把下面随机抽出的五件礼物，按出现的时间顺序放入卡槽（左 = 早，右 = 晚）：",
  errorMessages: [
    "顺序好像不太对，再想想这些礼物分别是什么时候出现的～",
    "按关键词去聊天记录查查吧～",
  ],
  successText: "礼物档案已归档完成。",
  nextCta: "进入未来的一日行程单",
};

// ===== 房间 3：未来的一日行程单 =====
import mealImg from "@/assets/room3/meal.png";
import popmartImg from "@/assets/room3/popmart.png";
import ticketImg from "@/assets/room3/ticket.png";
import mannerImg from "@/assets/room3/manner.png";
import mapImg from "@/assets/room3/map.png";

export type Room3Item = {
  id: string;
  label: string;
  icon: string;
  x: number; // %
  y: number;
  /** 物件特写图 */
  image: string;
  question: string;
  /** 字段定义：label 显示在 input 上方 */
  fields: { label?: string; placeholder?: string; prefix?: string; suffix?: string; width?: string }[];
  /** 每个字段可接受的答案数组（规范化后比较：去空格、转小写） */
  answers: string[][];
  errorMessages: [string, string];
  fragment: string; // 答对获得的碎片字
};

export const ROOM_3_DATA = {
  meta: {
    index: 3,
    total: 3,
    name: "未来的一日行程单",
    subtitle: "桌面上散落着我们下次见面的零件",
    ambient:
      "白色桌面上摊着一些东西：机票、小票、两碗面、两杯咖啡、一张北京地图。门旁柜子上有一只暗着的许愿瓶。",
    bottleHintEmpty: "收集五片愿望碎片后，把它们放进许愿瓶。",
    bottleHintReady: "碎片已集齐，可以点亮许愿瓶了。",
    bottleWrongOrder: "顺序好像不对哦，先把这句话念完整～",
    successText: "许愿瓶已成功点亮🌟",
    nextCta: "进入结算页",
  },
  /** 碎片的正确顺序（生→日→快→乐→呀） */
  fragmentOrder: ["生", "日", "快", "乐", "呀"],

  items: [
    {
      id: "noodles",
      label: "一顿大餐",
      icon: "🍜",
      x: 35,
      y: 62,
      image: mealImg,
      question: "我们说下次见面要再去哪里吃？",
      fields: [{ placeholder: "_ _ _ _", width: "w-36" }],
      answers: [["胖妹面庄"]],
      errorMessages: [
        "好像不是这家店，再想想我们一起种草的那家～",
        "招牌在重庆，红油辣面那种风格哦～",
      ],
      fragment: "快",
    },
    {
      id: "popmart",
      label: "POP MART 小票",
      icon: "🧾",
      x: 70,
      y: 28,
      image: popmartImg,
      question: "我们下次要再一起拆盲盒！考考你，它们分别是多少钱？",
      fields: [
        { label: "Nyota系列", prefix: "¥", width: "w-20" },
        { label: "星星人系列", prefix: "¥", width: "w-20" },
        { label: "Labubu机甲系列", prefix: "¥", width: "w-20" },
      ],
      answers: [["69"], ["69"], ["89"]],
      errorMessages: [
        "金额好像不太对，再回忆一下小票上的数字～",
        "其中有两个价格是相同的哦～",
      ],
      fragment: "日",
    },
    {
      id: "ticket",
      label: "一张从伦敦到北京的机票",
      icon: "🎫",
      x: 22,
      y: 30,
      image: ticketImg,
      question: "请问从伦敦飞到北京要几个小时？",
      fields: [{ suffix: "小时", width: "w-24" }],
      answers: [["10", "10小时", "约10", "约10小时"]],
      errorMessages: [
        "好像不是这个时长，再想想跨过半个地球要多久～",
        "比一个工作日多一点点～",
      ],
      fragment: "生",
    },
    {
      id: "coffee",
      label: "两杯 Manner",
      icon: "☕",
      x: 58,
      y: 60,
      image: mannerImg,
      question: "我们都最爱喝 Manner 的哪款咖啡！",
      fields: [{ placeholder: "_ _ _ _", width: "w-36" }],
      answers: [["冰葡美式"]],
      errorMessages: [
        "不是这一杯，再想想我们都爱的那款～",
        "这款含起泡、含某种水果～",
      ],
      fragment: "乐",
    },
    {
      id: "map",
      label: "一张北京地图",
      icon: "🗺️",
      x: 82,
      y: 70,
      image: mapImg,
      question: "这条路很眼熟吧！请问是经过了哪三个区？",
      fields: [
        { suffix: "区", width: "w-24" },
        { suffix: "区", width: "w-24" },
        { suffix: "区", width: "w-24" },
      ],
      answers: [["房山"], ["朝阳"], ["怀柔"]],
      errorMessages: [
        "路线好像不太对，再想想它跨过了北京的哪些地方～",
        "从西南一路往东北，跨过很多环～",
      ],
      fragment: "呀",
    },
  ] as Room3Item[],
};

