import { useEffect, useState } from "react";
import { competitionSeason } from "./prototype-data.js";

const STATUS_LABELS = {
  completed: "已完成",
  scheduled: "已排期",
  cancelled: "已取消",
};

function formatMatchNumber(number) {
  return String(number).padStart(2, "0");
}

function formatScore(score) {
  return score > 0 ? `+${score}` : String(score);
}

function Avatar({ player }) {
  const fallback = player.name.slice(0, 1);

  function showFallback(event) {
    event.currentTarget.hidden = true;
    const fallbackElement = event.currentTarget.previousElementSibling;
    if (fallbackElement) fallbackElement.hidden = false;
  }

  return (
    <span className="player-avatar">
      <span className="avatar-fallback" hidden aria-hidden="true">
        {fallback}
      </span>
      <img
        src={player.avatar}
        alt=""
        width="44"
        height="44"
        loading="lazy"
        onError={showFallback}
      />
    </span>
  );
}

function MatchCard({ match }) {
  const completed = match.status === "completed";

  return (
    <article className={`match-card match-card--${match.status}`}>
      <header className="match-card__header">
        <h4 className="match-card__title">
          <span>賽事 {formatMatchNumber(match.number)}</span>
          <span className="match-card__separator" aria-hidden="true">
            |
          </span>
          <span className="match-card__status">{STATUS_LABELS[match.status]}</span>
        </h4>
        {completed ? (
          <a
            className="match-details-link"
            href={match.detailsUrl}
            target="_blank"
            rel="noreferrer"
          >
            賽事詳情 <span aria-hidden="true">↗</span>
          </a>
        ) : null}
      </header>

      <ol className={`player-grid player-grid--${match.status}`}>
        {match.players.map((player, index) => (
          <li className="player-cell" key={`${match.id}-${player.name}`}>
            {completed ? (
              <span className="placement" aria-label={`第 ${match.placements[index]} 名`}>
                {match.placements[index]}
              </span>
            ) : null}
            <Avatar player={player} />
            <span className="player-copy">
              <span className="player-name">{player.name}</span>
              {completed ? (
                <span
                  className={`player-score ${
                    match.scores[index] < 0 ? "player-score--negative" : ""
                  }`}
                >
                  {formatScore(match.scores[index])}
                </span>
              ) : null}
            </span>
          </li>
        ))}
      </ol>
    </article>
  );
}

function MatchTypeGroup({ matchType }) {
  const matchCount = matchType.matches.length;

  return (
    <section className="match-type" aria-labelledby={`${matchType.id}-heading`}>
      <header className="match-type__header">
        <h3 id={`${matchType.id}-heading`}>{matchType.name}</h3>
        <span className="match-type__count">{matchCount} 場賽事</span>
      </header>
      <div className="match-grid">
        {matchType.matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>
    </section>
  );
}

function StageSection({ stage }) {
  return (
    <article className="stage-section" aria-labelledby={`${stage.id}-heading`}>
      <header className="stage-header">
        <div className="stage-header__content">
          <h2 id={`${stage.id}-heading`}>
            <span className="stage-header__round">{stage.title}</span>
            <span className="stage-header__separator" aria-hidden="true">
              |
            </span>
            <span className="stage-header__date">{stage.dateLabel}</span>
          </h2>
        </div>
      </header>
      <div className="stage-content">
        {stage.matchTypes.map((matchType) => (
          <MatchTypeGroup key={matchType.id} matchType={matchType} />
        ))}
      </div>
    </article>
  );
}

function NavigationPanel({ open, onNavigate }) {
  return (
    <nav
      className="site-navigation"
      id="site-navigation"
      aria-label="主要導覽"
      hidden={!open}
    >
      <a href="#season-overview" onClick={onNavigate}>
        賽季總覽 <span aria-hidden="true">↗</span>
      </a>
      <a href="#results" aria-current="page" onClick={onNavigate}>
        賽事結果 <span aria-hidden="true">↘</span>
      </a>
      <a href="#footer" onClick={onNavigate}>
        WRPM 香港分部 <span aria-hidden="true">↗</span>
      </a>
    </nav>
  );
}

export function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!menuOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setMenuOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  return (
    <div className="prototype-shell">
      <a className="skip-link" href="#season-overview">
        跳至主要內容
      </a>

      <header className="site-header">
        <div className="site-header__inner">
          <button
            className="nav-toggle"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="site-navigation"
            aria-label={menuOpen ? "關閉導覽" : "開啟導覽"}
            onClick={() => setMenuOpen((isOpen) => !isOpen)}
          >
            <span className="menu-icon" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </button>

          <a className="site-brand" href="#season-overview" onClick={() => setMenuOpen(false)}>
            <img
              className="site-brand__logo"
              src="/assets/wrpm-logo.png"
              alt=""
              width="42"
              height="42"
            />
            <span className="site-brand__wordmark">
              <strong>WRPM</strong>
              <span>香港分部</span>
            </span>
          </a>

          <div className="language-switcher" aria-label="語言選擇">
            <a href="#language-zh" aria-current="page">
              繁中
            </a>
            <a href="#language-en">EN</a>
            <a href="#language-ja">JA</a>
          </div>
        </div>
        <NavigationPanel open={menuOpen} onNavigate={() => setMenuOpen(false)} />
      </header>

      <main id="season-overview">
        <section className="page-intro" aria-labelledby="page-title">
          <a className="back-link" href="#season-overview">
            <span aria-hidden="true">←</span> 返回賽季總覽
          </a>
          <p className="page-intro__eyebrow">香港聯賽 · 2026 秋季</p>
          <h1 id="page-title">賽事結果</h1>
          <p className="page-intro__season">{competitionSeason.title}</p>
        </section>

        <section className="results-section" id="results" aria-labelledby="results-title">
          <div className="results-section__heading">
            <div>
              <p className="section-kicker">已選賽季</p>
              <h2 id="results-title">階段賽程</h2>
            </div>
            <p className="results-section__summary">
              {competitionSeason.stages.length} 個階段 · 日期由新至舊
            </p>
          </div>

          <div className="stage-timeline">
            {competitionSeason.stages.map((stage) => (
              <StageSection key={stage.id} stage={stage} />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer" id="footer">
        <div className="site-footer__inner">
          <strong>WRPM 香港分部</strong>
          <p>© 2026 · 保留所有權利</p>
        </div>
      </footer>
    </div>
  );
}
