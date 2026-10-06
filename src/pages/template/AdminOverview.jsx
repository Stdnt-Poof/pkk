function AdminOverview() {
  return (
    <div>
      <div className="adm-grid-kpi">
        <div className="adm-kpi">
          <span>Users</span>
          <strong>24892</strong>
        </div>
        <div className="adm-kpi">
          <span>Active this week</span>
          <strong>8421</strong>
        </div>
        <div className="adm-kpi">
          <span>Posts 24h</span>
          <strong>1284</strong>
        </div>
        <div className="adm-kpi">
          <span>Open reports</span>
          <strong>17</strong>
        </div>
      </div>

      <br />

      <div className="adm-grid-kpi">
        <div className="adm-kpi">
          <span>Palettes 30d</span>
          <strong>12482</strong>
        </div>
        <div className="adm-kpi">
          <span>Templates total</span>
          <strong>3420</strong>
        </div>
        <div className="adm-kpi">
          <span>Active groups</span>
          <strong>1294</strong>
        </div>
        <div className="adm-kpi">
          <span>New signups 7d</span>
          <strong>312</strong>
        </div>
      </div>

      <br />

      <div className="adm-two">
        <section className="adm-panel">
          <h2>Needs attention</h2>
          <table className="adm-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Age</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Post</td>
                <td>@alex — UI redesign thread</td>
                <td><span className="adm-badge warn">Spam</span></td>
                <td>2m</td>
              </tr>
              <tr>
                <td>User</td>
                <td>@john</td>
                <td><span className="adm-badge bad">Harassment</span></td>
                <td>12m</td>
              </tr>
              <tr>
                <td>Template</td>
                <td>SaaS Landing Page copy</td>
                <td><span className="adm-badge warn">Copyright</span></td>
                <td>24m</td>
              </tr>
              <tr>
                <td>Group</td>
                <td>Figma Tips</td>
                <td><span className="adm-badge warn">NSFW</span></td>
                <td>41m</td>
              </tr>
            </tbody>
          </table>
          <p className="adm-note">Static preview only. Live queue lives in Reports tab. No backend calls.</p>
        </section>

        <section className="adm-panel">
          <h2>Feature usage</h2>
          <p className="adm-note">Posts</p>
          <div className="adm-bar"><i style={{ width: '72%' }} /></div>
          <br />
          <p className="adm-note">Templates viewed</p>
          <div className="adm-bar"><i style={{ width: '90%' }} /></div>
          <br />
          <p className="adm-note">Palettes generated</p>
          <div className="adm-bar"><i style={{ width: '64%' }} /></div>
          <br />
          <p className="adm-note">Groups created</p>
          <div className="adm-bar"><i style={{ width: '28%' }} /></div>
          <br />
          <p className="adm-note">Mono 7832 vs Complementary 4650. Popular base: Blue 28 percent, Purple 21 percent.</p>
        </section>
      </div>
    </div>
  )
}

export default AdminOverview
