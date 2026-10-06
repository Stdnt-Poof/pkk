function AdminGroups() {
  return (
    <section className="adm-panel">
      <h2>Groups — metadata only</h2>
      <p className="adm-note">No bulk chat reading. Membership plus activity only. Message content opens only from a report.</p>
      <table className="adm-table">
        <thead>
          <tr>
            <th>Group</th>
            <th>Members</th>
            <th>Msgs per day</th>
            <th>Reports</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>UI Designers ID</strong><br />owner @alex — created 2026-01-10</td>
            <td>248</td>
            <td>1293</td>
            <td>0</td>
            <td><span className="adm-badge good">Active</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Members</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Figma Tips</strong><br />owner @mika — created 2026-02-04</td>
            <td>87</td>
            <td>428</td>
            <td>2</td>
            <td><span className="adm-badge warn">Review</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Members</button>
                <button type="button" className="adm-btn">Suspend</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Web Design</strong><br />owner @kate — created 2026-04-22</td>
            <td>51</td>
            <td>102</td>
            <td>0</td>
            <td><span className="adm-badge good">Active</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Members</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><strong>Motion Study</strong><br />owner @sam — created 2026-06-11</td>
            <td>23</td>
            <td>44</td>
            <td>0</td>
            <td><span className="adm-badge good">Active</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Members</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="adm-note">User detail rule: show group names plus count, for example @mika is in 5 groups.</p>
    </section>
  )
}

export default AdminGroups
