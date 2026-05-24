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
    "密码不对哦，再看看三个数字之间是什么关系～",
    "这是一道你高中最擅长的学科的问题，很简单，再试试吧～",
  ],
  successText:
    "门锁咔哒一声打开了。\n原来世界两端的时间，也可以被算进同一个答案里。",
  nextCta: "进入礼物档案室",
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
export type Exhibit = {
  id: string; // "e1" ~ "e10"
  no: number;
  name: string;
  icon: string;
  desc: string;
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
    { id: "e1", no: 1, name: "AirPods", icon: "🎧", desc: "第一次想着「希望你走路上耳朵里有我挑的歌」。" },
    { id: "e2", no: 2, name: "宝矿力", icon: "🧴", desc: "你那次发烧到 39 度，我冲了一整箱过去。" },
    { id: "e3", no: 3, name: "电动牙刷", icon: "🪥", desc: "你说想好好刷牙，我立刻下了单。" },
    { id: "e4", no: 4, name: "护肤套盒", icon: "🧖‍♀️", desc: "柜姐推荐的那套，说很适合你。" },
    { id: "e5", no: 5, name: "ON 金标蛋白粉", icon: "🥛", desc: "陪你健身的那阵子，每天一勺。" },
    { id: "e6", no: 6, name: "斜挎包", icon: "👜", desc: "挑了能塞下笔电的那一款。" },
    { id: "e7", no: 7, name: "宝格丽大吉岭茶香水", icon: "🌸", desc: "第一次见你之后，我一直记得那股味道。" },
    { id: "e8", no: 8, name: "乐高法拉利积木", icon: "🏎️", desc: "拼了一个下午，盒子比你人还大。" },
    { id: "e9", no: 9, name: "lululemon 运动服", icon: "🩱", desc: "想你跑步的时候穿得舒服一点。" },
    { id: "e10", no: 10, name: "鱼油", icon: "🐟", desc: "希望你别熬夜了，但我知道你会。" },
  ] as Exhibit[],

  // 五个需要排序的展品
  sortablePool: ["e2", "e1", "e7", "e10", "e8"],
  // 正确的时间顺序（从 2020 → 2026）
  correctOrder: ["e2", "e1", "e7", "e10", "e8"],
  slotLabels: ["2020", "2022", "2023", "2025", "2026"],

  puzzlePrompt:
    "把这五件礼物，按出现的时间顺序拖进卡槽（左 = 早，右 = 晚）：",
  errorMessages: [
    "顺序好像不太对，再想想这些礼物分别是什么时候出现的～",
    "按关键词去聊天记录查查吧～",
  ],
  successText:
    "礼物档案已归档完成。\n原来这些东西不只是礼物，还是我们一路走过来的证据。",
  nextCta: "进入未来的一日行程单",
};

// ===== 房间 3：未来的一日行程单 =====
export type Room3Item = {
  id: string;
  label: string;
  icon: string;
  x: number; // %
  y: number;
  /** 物件详情视觉展示文案（modal 顶部） */
  visual: string[];
  question: string;
  /** 字段定义：占位 + 前缀（如 "¥"）+ 后缀（如 "小时"） */
  fields: { placeholder?: string; prefix?: string; suffix?: string; width?: string }[];
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
    bottleHintReady: "愿望碎片已收集完成。\n请按顺序把它们放进许愿瓶。",
    bottleWrongOrder: "顺序好像不对哦，先把这句话念完整～",
    successText: "许愿瓶被点亮了。",
    nextCta: "进入结算页",
  },
  /** 碎片的正确顺序（生→日→快→乐→呀） */
  fragmentOrder: ["生", "日", "快", "乐", "呀"],

  items: [
    {
      id: "ticket",
      label: "机票",
      icon: "🎫",
      x: 22,
      y: 30,
      visual: [
        "✈️  伦敦希思罗 LHR  →  北京首都 PEK",
        "舱位：经济舱  ·  航班：BA039（示意）",
        "飞行时长：______ 小时",
      ],
      question: "直飞大约需要几个小时？",
      fields: [{ placeholder: "10", suffix: "小时", width: "w-24" }],
      answers: [["10", "约10", "10小时", "约10小时"]],
      errorMessages: [
        "好像不是这个时长，再想想跨过半个地球要多久～",
        "查查上次航班再试试吧～",
      ],
      fragment: "生",
    },
    {
      id: "popmart",
      label: "POP MART 小票",
      icon: "🧾",
      x: 70,
      y: 28,
      visual: [
        "POP MART · 未来某天",
        "—————————————",
        "星星人          ¥ ______",
        "Nyota           ¥ ______",
        "机甲版 Labubu   ¥ ______",
      ],
      question: "请按顺序填入小票上的缺失金额：",
      fields: [
        { placeholder: "星星人", prefix: "¥", width: "w-20" },
        { placeholder: "Nyota", prefix: "¥", width: "w-20" },
        { placeholder: "机甲", prefix: "¥", width: "w-20" },
      ],
      answers: [["69"], ["69"], ["89"]],
      errorMessages: [
        "金额好像不太对，再看看这张未来小票～",
        "其中有两个价格相同，再试试吧～",
      ],
      fragment: "日",
    },
    {
      id: "noodles",
      label: "两个圆碗",
      icon: "🍜",
      x: 35,
      y: 62,
      visual: [
        "🥣  辣面（红油上一个大大的 ❌）",
        "🥣  白面（旁边也画着 ❌）",
        "（不吃辣 + 不吃白，看来是冲招牌去的。）",
      ],
      question: "这是哪家店的面面？",
      fields: [{ placeholder: "_ _ _ _", width: "w-32" }],
      answers: [["胖妹面庄"]],
      errorMessages: [
        "不对哦，这家店还有一个很适合一起点的东西～",
        "绿豆沙冰",
      ],
      fragment: "快",
    },
    {
      id: "coffee",
      label: "两杯 Manner",
      icon: "☕",
      x: 58,
      y: 60,
      visual: [
        "🥤 Manner  ·  Cup #1",
        "🥤 Manner  ·  Cup #2",
        "（杯壁上挂着小气泡，闻起来有点葡萄味。）",
      ],
      question: "这是我们都爱的哪款 Manner 咖啡？",
      fields: [{ placeholder: "_ _ _ _", width: "w-32" }],
      answers: [["冰葡美式"]],
      errorMessages: [
        "不是这一杯，再想想我们都爱的那款～",
        "此款咖啡含起泡、含某种水果",
      ],
      fragment: "乐",
    },
    {
      id: "map",
      label: "北京地图",
      icon: "🗺️",
      x: 82,
      y: 70,
      visual: [
        "简化版北京地图：",
        "·  西南角一个点 → 向上",
        "·  到正中偏上一个点 → 再向上",
        "·  到纸张最上方偏左一个点",
        "（一条要开很久很久的路线。）",
      ],
      question: "这是从哪里到哪里到哪里的路线？",
      fields: [
        { placeholder: "?", suffix: "区", width: "w-20" },
        { placeholder: "?", suffix: "区", width: "w-20" },
        { placeholder: "?", suffix: "区", width: "w-20" },
      ],
      answers: [["房山"], ["朝阳"], ["怀柔"]],
      errorMessages: [
        "路线好像不太对，再想想它跨过了北京的哪些地方～",
        "开车要很久很久，跨过很多环。",
      ],
      fragment: "呀",
    },
  ] as Room3Item[],
};
