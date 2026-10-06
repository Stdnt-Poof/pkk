function AdminUsers() {
  return (
    <section className="adm-panel">
      <h2>Users — readable, not explicit</h2>
      <p className="adm-note">Masked contact info. Full profile opens on user side. Suspend or ban only.</p>
      <table className="adm-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Joined</th>
            <th>Posts</th>
            <th>Groups</th>
            <th>Reports</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>Alex</strong><br />@alex<br />a***@mail.com</td>
            <td>2025-11-02</td>
            <td>142</td>
            <td>3</td>
            <td>0</td>
            <td><span className="adm-badge good">Active</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Warn</button>
                <button type="button" className="adm-btn">Suspend</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Mika</strong><br />@mika<br />m***@mail.com</td>
            <td>2026-01-14</td>
            <td>89</td>
            <td>5</td>
            <td>2</td>
            <td><span className="adm-badge warn">Review</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Warn</button>
                <button type="button" className="adm-btn">Suspend</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>John</strong><br />@john<br />j***@mail.com</td>
            <td>2025-08-30</td>
            <td>12</td>
            <td>1</td>
            <td>4</td>
            <td><span className="adm-badge bad">Flagged</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Warn</button>
                <button type="button" className="adm-btn danger">Ban</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Kate</strong><br />@kate<br />k***@mail.com</td>
            <td>2026-03-01</td>
            <td>64</td>
            <td>2</td>
            <td>0</td>
            <td><span className="adm-badge good">Active</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Warn</button>
                <button type="button" className="adm-btn">Suspend</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Sam</strong><br />@sam<br />s***@mail.com</td>
            <td>2026-05-19</td>
            <td>31</td>
            <td>0</td>
            <td>1</td>
            <td><span className="adm-badge warn">Review</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Warn</button>
                <button type="button" className="adm-btn">Suspend</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="adm-note">Detail shows: bio, portfolio link, follower counts, group names plus count, template count, palette count. Never passwords or tokens.</p>
    </section>
  )
}

export default AdminUsers
