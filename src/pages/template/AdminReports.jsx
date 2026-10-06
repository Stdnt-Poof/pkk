function AdminReports() {
  return (
    <section className="adm-panel">
      <h2>Reports queue — 12 open</h2>
      <p className="adm-note">Reddit-style triage. Dismiss, remove target, or warn author. All writes belong in audit log later.</p>
      <table className="adm-table">
        <thead>
          <tr>
            <th>Report</th>
            <th>Target</th>
            <th>Reason</th>
            <th>Reporter</th>
            <th>Time</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Post</td>
            <td>@alex — UI redesign thread</td>
            <td><span className="adm-badge warn">Spam</span></td>
            <td>@mika</td>
            <td>2m</td>
            <td>Pending</td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Dismiss</button>
                <button type="button" className="adm-btn danger">Remove</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>User</td>
            <td>@john</td>
            <td><span className="adm-badge bad">Harassment</span></td>
            <td>@kate</td>
            <td>8m</td>
            <td>Pending</td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Dismiss</button>
                <button type="button" className="adm-btn">Warn</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Comment</td>
            <td>#18392</td>
            <td><span className="adm-badge bad">NSFW</span></td>
            <td>@sam</td>
            <td>20m</td>
            <td>Reviewing</td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Dismiss</button>
                <button type="button" className="adm-btn danger">Remove</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Template</td>
            <td>Portfolio copy</td>
            <td><span className="adm-badge warn">Copyright</span></td>
            <td>@mika</td>
            <td>24m</td>
            <td>Pending</td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Dismiss</button>
                <button type="button" className="adm-btn danger">Remove</button>
              </div>
            </td>
          </tr>
          <tr>
            <td>Group</td>
            <td>Figma Tips</td>
            <td><span className="adm-badge warn">Scam</span></td>
            <td>@alex</td>
            <td>1h</td>
            <td>Pending</td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Dismiss</button>
                <button type="button" className="adm-btn">Investigate</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="adm-note">Reasons: spam, harassment, hate, NSFW, copyright, misleading, scam, other.</p>
    </section>
  )
}

export default AdminReports
