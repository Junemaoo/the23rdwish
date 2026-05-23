// 所有谜题数据和文案，方便后续修改

export const OPENING = {
  title: "小毛子独家定制密室",
  subtitle: "——第 23 次许愿",
  intro: [
    "今天是你的第 23 个生日。",
    "我把这一年里所有想对你说的话，藏在了三间小房间里。",
    "推开门，慢慢走，最后会有一个许愿的位置在等你。",
  ],
  enterCta: "推开第一扇门",
};

export type RoomConfig = {
  id: string;
  index: number;
  name: string;
  subtitle: string;
  ambient: string; // 房间氛围描述
  hotspots: {
    id: string;
    label: string; // 热点名称（点击后显示）
    x: number; // % 位置
    y: number;
    icon: string; // emoji 占位
    clueTitle: string;
    clueText: string;
  }[];
  puzzlePrompt: string;
  puzzleHint: string;
  answer: string; // 不区分大小写
  successText: string;
  nextCta: string;
};

export const ROOMS: RoomConfig[] = [
  {
    id: "room1",
    index: 1,
    name: "我们，在世界的两端",
    subtitle: "时差 · 想念 · 一句没说出口的话",
    ambient: "暖黄台灯、木质书桌、墙上贴着两张明信片，窗外是不同时区的夜色。",
    hotspots: [
      {
        id: "clock-left",
        label: "我这边的钟",
        x: 18,
        y: 30,
        icon: "🕗",
        clueTitle: "我这边的时间",
        clueText: "现在是晚上 8:00，我刚煮好一锅你爱吃的番茄牛腩。",
      },
      {
        id: "clock-right",
        label: "你那边的钟",
        x: 78,
        y: 30,
        icon: "🕐",
        clueTitle: "你那边的时间",
        clueText: "你那边是凌晨 1:00，应该刚下班瘫在沙发上吧。",
      },
      {
        id: "postcard",
        label: "桌上的明信片",
        x: 50,
        y: 65,
        icon: "💌",
        clueTitle: "明信片背面",
        clueText:
          "「不管隔多少小时，我都把它换算成——我有多想你。」\n提示：把两边的时间相减，得到一个数字。",
      },
      {
        id: "cup",
        label: "凉掉的咖啡",
        x: 30,
        y: 72,
        icon: "☕",
        clueTitle: "杯垫上写着",
        clueText: "等你回来一起喝。",
      },
    ],
    puzzlePrompt: "我们之间，差了几个小时？（请输入数字）",
    puzzleHint: "20:00 与次日 01:00 之间的小时差。",
    answer: "5",
    successText:
      "5 个小时而已。\n我把这 5 个小时，全部用来想你了。",
    nextCta: "走向下一间房",
  },
  {
    id: "room2",
    index: 2,
    name: "礼物档案室",
    subtitle: "那些我偷偷收着的小东西",
    ambient: "一整面木格子墙，每一格放着一件小物，标签上是日期。",
    hotspots: [
      {
        id: "g1",
        label: "格子 · 2022.07",
        x: 18,
        y: 28,
        icon: "🎀",
        clueTitle: "第一次送你的发圈",
        clueText: "你那天扎了个很乱的丸子头，但我觉得超好看。",
      },
      {
        id: "g2",
        label: "格子 · 2023.02",
        x: 42,
        y: 28,
        icon: "📖",
        clueTitle: "你借我又忘了拿回去的书",
        clueText: "我在第 23 页折了一个角，那一页写着「我喜欢你」。",
      },
      {
        id: "g3",
        label: "格子 · 2024.05",
        x: 66,
        y: 28,
        icon: "🐻",
        clueTitle: "夹娃娃机里抓到的小熊",
        clueText: "我抓了 11 次才出来，但跟你说是一次就中。",
      },
      {
        id: "g4",
        label: "格子 · 2025.11",
        x: 30,
        y: 65,
        icon: "🎟️",
        clueTitle: "那场演唱会的票根",
        clueText: "你在副歌的时候偷偷哭了，我假装没看见。",
      },
      {
        id: "g5",
        label: "最上面那一格",
        x: 78,
        y: 60,
        icon: "🗝️",
        clueTitle: "一把小钥匙",
        clueText:
          "标签上写着：「数一数，这间房里我藏了多少件礼物？把数字告诉我。」",
      },
    ],
    puzzlePrompt: "这间档案室里一共有几件礼物？（输入数字）",
    puzzleHint: "把所有的格子都点一遍，包括最上面那把钥匙。",
    answer: "5",
    successText:
      "其实远远不止 5 件。\n只是房间太小，装不下我想送你的全部。",
    nextCta: "去看看明天",
  },
  {
    id: "room3",
    index: 3,
    name: "未来的一日行程单",
    subtitle: "等我们见面那天，就按这个来",
    ambient: "一张铺开的牛皮纸行程单，上面有几个空格等你填。",
    hotspots: [
      {
        id: "p1",
        label: "上午 · 早餐店",
        x: 22,
        y: 30,
        icon: "🥐",
        clueTitle: "上午",
        clueText: "去你最爱的那家店，点两份可颂，一份咸一份甜。",
      },
      {
        id: "p2",
        label: "中午 · 旧书店",
        x: 50,
        y: 30,
        icon: "📚",
        clueTitle: "中午",
        clueText: "钻进那家旧书店，比赛谁先找到带「光」字的书名。",
      },
      {
        id: "p3",
        label: "下午 · 海边",
        x: 78,
        y: 30,
        icon: "🌊",
        clueTitle: "下午",
        clueText: "坐最慢的那班车去海边，什么都不做，就坐着。",
      },
      {
        id: "p4",
        label: "傍晚 · 便利店",
        x: 30,
        y: 68,
        icon: "🍙",
        clueTitle: "傍晚",
        clueText: "便利店买关东煮，坐在马路牙子上吃。",
      },
      {
        id: "p5",
        label: "夜里 · 阳台",
        x: 68,
        y: 68,
        icon: "🌙",
        clueTitle: "夜里",
        clueText:
          "回家，坐在阳台上，说一句很重要的话。\n提示：那句话只有三个字，是这个密室一直在偷偷讲的话。",
      },
    ],
    puzzlePrompt: "请输入那句要在阳台上说的话（三个字）：",
    puzzleHint: "整个密室藏的那件事，最简单的三个字。",
    answer: "我爱你",
    successText:
      "好。\n那天我们就这样过，从早到晚，一秒都不浪费。",
    nextCta: "推开最后一扇门",
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

export const MAX_WRONG_HINT = 3; // 错误几次后强制提示
