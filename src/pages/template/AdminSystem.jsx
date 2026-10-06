function AdminSystem() {
  return (
    <div>
      <section className="adm-panel">
        <h2>Admins — one role, many people</h2>
        <table className="adm-table">
          <thead>
            <tr>
              <th>Handle</th>
              <th>Added by</th>
              <th>Last active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>@root — admin</td>
              <td>system</td>
              <td>2026-10-06</td>
              <td>
                <div className="adm-actions">
                  <button type="button" className="adm-btn">View</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>@shlofte — admin</td>
              <td>@root</td>
              <td>2026-10-05</td>
              <td>
                <div className="adm-actions">
                  <button type="button" className="adm-btn">View</button>
                  <button type="button" className="adm-btn danger">Remove</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="adm-note">Add by handle only. No role picker in v1.</p>
      </section>

      <br />

      <div className="adm-two">
        <section className="adm-panel">
          <h2>Settings — flags</h2>
          <p className="adm-note">Palette generator: ON</p>
          <p className="adm-note">Template library: ON</p>
          <p className="adm-note">Group chat: ON</p>
          <p className="adm-note">Group size limit: 250</p>
          <p className="adm-note">Banner: none</p>
          <div className="adm-actions">
            <button type="button" className="adm-btn">Edit flags</button>
          </div>
        </section>
        <section className="adm-panel">
          <h2>Audit log</h2>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Admin</th>
                <th>Action</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>@root</td>
                <td>Removed post #18392 — spam</td>
                <td>2026-10-06 09:12</td>
              </tr>
              <tr>
                <td>@shlofte</td>
                <td>Featured template Dashboard UI</td>
                <td>2026-10-05 16:40</td>
              </tr>
              <tr>
                <td>@root</td>
                <td>Warned @john — harassment</td>
                <td>2026-10-05 11:02</td>
              </tr>
            </tbody>
          </table>
        </section>
      </div>
    </div>
  )
}

export default AdminSystem
