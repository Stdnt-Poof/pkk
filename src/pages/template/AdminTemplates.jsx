function AdminTemplates() {
  return (
    <section className="adm-panel">
      <h2>Templates — open upload, takedown model</h2>
      <p className="adm-note">Anyone can publish. Admin only removes, features, or recategorizes. No approval queue.</p>
      <table className="adm-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Title</th>
            <th>Uploader</th>
            <th>Category</th>
            <th>Use</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><div className="adm-thumb" /></td>
            <td>SaaS Landing Page<br />tags: SaaS, Minimal, Dark</td>
            <td>@mika</td>
            <td>Web</td>
            <td>1284</td>
            <td><span className="adm-badge good">Published</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Feature</button>
                <button type="button" className="adm-btn">Retag</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><div className="adm-thumb" /></td>
            <td>Dashboard UI<br />tags: Admin, Charts</td>
            <td>@alex</td>
            <td>Dashboard</td>
            <td>982</td>
            <td><span className="adm-badge good">Featured</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Unfeature</button>
                <button type="button" className="adm-btn">Retag</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><div className="adm-thumb" /></td>
            <td>Portfolio Grid<br />tags: Portfolio, Type</td>
            <td>@kate</td>
            <td>Portfolio</td>
            <td>841</td>
            <td><span className="adm-badge good">Published</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">Feature</button>
                <button type="button" className="adm-btn">Retag</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><div className="adm-thumb" /></td>
            <td>Portfolio copy<br />tags: Portfolio</td>
            <td>@john</td>
            <td>Portfolio</td>
            <td>12</td>
            <td><span className="adm-badge bad">Reported</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn danger">Delete</button>
                <button type="button" className="adm-btn">View report</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <p className="adm-note">Categories: Web, Dashboard, Portfolio, E-commerce, Mobile, Components. Tags stay free-form for now.</p>
    </section>
  )
}

export default AdminTemplates
