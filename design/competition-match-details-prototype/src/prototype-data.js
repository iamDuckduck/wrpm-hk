const avatar = (number) =>
  number === 1 ? "/assets/avatars/avatar-01.webp" : `/assets/avatars/avatar-0${number}.png`;

const completedPlayers = [
  { name: "星野 妙奈", avatar: avatar(1) },
  { name: "天音 海澄", avatar: avatar(2) },
  { name: "森下 葵", avatar: avatar(3) },
  { name: "藍川 凛", avatar: avatar(4) },
];

const matchPlayers = (names) =>
  names.map((name, index) => ({
    name,
    avatar: avatar((index % 4) + 1),
  }));

const completedMatch = (id, number, names, scores, detailsUrl) => ({
  id,
  number,
  status: "completed",
  players: names ? matchPlayers(names) : completedPlayers,
  placements: [1, 2, 3, 4],
  scores,
  detailsUrl,
});

const pendingMatch = (id, number, status, names) => ({
  id,
  number,
  status,
  players: matchPlayers(names),
});

export const competitionSeason = {
  title: "香港麻雀 · 2026 秋季",
  status: "ongoing",
  stages: [
    {
      id: "round-03",
      sortKey: 3,
      title: "第 3 輪",
      dateLabel: "2026-09-10（一天賽）",
      matchTypes: [
        {
          id: "round-03-live-table",
          name: "直播桌",
          matches: [
            completedMatch(
              "round-03-live-table-01",
              1,
              null,
              [38, 12, -14, -36],
              "https://example.invalid/matches/round-03-live-table-01",
            ),
            completedMatch(
              "round-03-live-table-02",
              2,
              ["小鳥遊 遙", "白石 雫", "花園 琴音", "椎名 真白"],
              [45, 18, -10, -53],
              "https://example.invalid/matches/round-03-live-table-02",
            ),
          ],
        },
      ],
    },
    {
      id: "round-02",
      sortKey: 2,
      title: "第 2 輪",
      dateLabel: "2026-08-26 – 2026-08-28（三日賽）",
      matchTypes: [
        {
          id: "round-02-group-a",
          name: "A 組",
          matches: [
            pendingMatch("round-02-group-a-01", 1, "scheduled", ["小鳥遊 遙", "櫻井 莫咲", "佐伯 澪", "長谷川 結衣"]),
            pendingMatch("round-02-group-a-02", 2, "scheduled", ["白石 雫", "宮本 千尋", "花園 琴音", "藤原 紬"]),
          ],
        },
        {
          id: "round-02-group-b",
          name: "B 組",
          matches: [
            pendingMatch("round-02-group-b-01", 1, "scheduled", ["九條 楓", "東條 翼", "黒崎 駿", "三宅 海斗"]),
            pendingMatch("round-02-group-b-02", 2, "scheduled", ["月城 莉子", "若宮 詩織", "星川 梓", "大和 悠真"]),
          ],
        },
      ],
    },
    {
      id: "round-01",
      sortKey: 1,
      title: "第 1 輪",
      dateLabel: "2026-08-20 – 2026-08-25（六日賽）",
      matchTypes: [
        {
          id: "round-01-live-table",
          name: "直播桌",
          matches: [
            pendingMatch("round-01-live-table-01", 1, "cancelled", ["參賽者 A", "參賽者 B", "參賽者 C", "參賽者 D"]),
            pendingMatch("round-01-live-table-02", 2, "cancelled", ["參賽者 A", "參賽者 B", "參賽者 C", "參賽者 D"]),
          ],
        },
      ],
    },
  ],
};
