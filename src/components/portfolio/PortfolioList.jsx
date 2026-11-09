import defaultProjectPreview from "../../assets/DefaultProject.png"
import { isValidExternalUrl } from "./portfolioUtils"

const KIND_LABEL = { portfolio: "Portfolio", cv: "CV", project: "Project" }

function PortfolioList({ items, onOpen, emptyText = "No items yet — use the button above to add one.", view = "list" }) {
  if (items.length === 0) {
    return <p className="feed-empty">{emptyText}</p>
  }

  return (
    <ul className={view === "grid" ? "pf-list pf-grid" : "pf-list"}>
      {items.map((item) => {
        const isCv = item.kind === "cv"
        const isProject = item.kind === "project"
        // Projects fall back to the bundled placeholder until a preview is uploaded.
        const preview = item.preview_url || (isProject ? defaultProjectPreview : null)

        return (
          <li key={item.id}>
            <button
              type="button"
              className="pf-row"
              onClick={() => onOpen(item)}
              title={isCv ? "Opens preview" : "Opens in a new browser tab"}
            >
              <span className="pf-thumb" aria-hidden="true">
                {preview ? (
                  <img src={preview} alt="" loading="lazy" />
                ) : isCv ? (
                  <span className="pf-thumb-pdf">PDF</span>
                ) : (
                  <span className="pf-thumb-link">↗</span>
                )}
              </span>
              <span className="pf-row-body">
                <span className="pf-row-title">{item.title}</span>
                <span className="pf-row-sub">
                  <span className="pf-badge">{KIND_LABEL[item.kind] || item.kind}</span>
                  {isCv ? (
                    <span>PDF · preview + .pdf download</span>
                  ) : isProject ? (
                    <span>GitHub / GitLab</span>
                  ) : (
                    <span>
                      {isValidExternalUrl(item.external_url) ? "Opens in new tab" : "Check link"}
                    </span>
                  )}
                </span>
              </span>
              <span className="pf-row-open" aria-hidden="true">
                {isCv ? "›" : "↗"}
              </span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}

export default PortfolioList
