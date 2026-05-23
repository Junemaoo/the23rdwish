// 所有谜题数据和文案，方便后续修改

export const OPENING = {
  title: "小毛子独家定制密室逃脱",
  subtitle: "——第 23 次许愿",
  intro: [
    "欢迎进入小毛子独家定制密室逃脱。",
    "本密室共三间房间。",
    "请点击房间中的高亮物件，寻找线索，完成第 23 次许愿。",
    "电脑端体验最佳，游玩时间约 10–15 分钟。",
  ],
  enterCta: "开始第 23 次许愿",
};

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
