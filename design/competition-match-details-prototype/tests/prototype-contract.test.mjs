import assert from "node:assert/strict";
import test from "node:test";
import { competitionSeason } from "../src/prototype-data.js";

const MATCH_DATE_FIELDS = ["date", "time", "startsAt", "startsOn", "scheduledAt"];
const RESULT_FIELDS = ["placements", "scores", "detailsUrl"];

test("competition stages are newest first and own the only dates", () => {
  assert.ok(Array.isArray(competitionSeason.stages));
  assert.ok(competitionSeason.stages.length >= 2);

  for (let index = 1; index < competitionSeason.stages.length; index += 1) {
    assert.ok(
      competitionSeason.stages[index - 1].sortKey >= competitionSeason.stages[index].sortKey,
      "stages should be ordered newest first",
    );
  }

  for (const stage of competitionSeason.stages) {
    assert.ok(stage.dateLabel, "each stage should describe its date or date range");

    for (const matchType of stage.matchTypes) {
      for (const match of matchType.matches) {
        for (const field of MATCH_DATE_FIELDS) {
          assert.equal(
            Object.hasOwn(match, field),
            false,
            `matches must not own ${field}; dates belong to stages`,
          );
        }
      }
    }
  }
});

test("every match has exactly four Mahjong players", () => {
  for (const stage of competitionSeason.stages) {
    for (const matchType of stage.matchTypes) {
      for (const match of matchType.matches) {
        assert.equal(match.players.length, 4, `${match.id} should have four players`);
        assert.ok(match.players.every((player) => player.name && player.avatar), `${match.id} players need names and avatars`);
      }
    }
  }
});

test("completed matches expose unique results and a details link", () => {
  const completedMatches = [];

  for (const stage of competitionSeason.stages) {
    for (const matchType of stage.matchTypes) {
      for (const match of matchType.matches) {
        if (match.status === "completed") completedMatches.push(match);
      }
    }
  }

  assert.ok(completedMatches.length > 0, "the prototype should include a completed match");

  for (const match of completedMatches) {
    assert.equal(match.placements.length, 4);
    assert.equal(new Set(match.placements).size, 4);
    assert.equal(match.scores.length, 4);
    assert.ok(match.detailsUrl);
  }
});

test("scheduled and cancelled matches do not expose results or details", () => {
  const pendingStatuses = new Set(["scheduled", "cancelled"]);
  let pendingMatchCount = 0;

  for (const stage of competitionSeason.stages) {
    for (const matchType of stage.matchTypes) {
      for (const match of matchType.matches) {
        if (!pendingStatuses.has(match.status)) continue;
        pendingMatchCount += 1;

        for (const field of RESULT_FIELDS) {
          assert.equal(
            Object.hasOwn(match, field),
            false,
            `${match.status} matches must not own ${field}`,
          );
        }
      }
    }
  }

  assert.ok(pendingMatchCount >= 2, "the prototype should include scheduled and cancelled matches");
});
