function AdminPosts() {
  return (
    <section className="adm-panel">
      <h2>Posts — image-first moderation</h2>
      <p className="adm-note">Design posts need thumbnails. Hide, delete, restore, or feature.</p>
      <table className="adm-table">
        <thead>
          <tr>
            <th>Preview</th>
            <th>Post</th>
            <th>Author</th>
            <th>Likes</th>
            <th>Reports</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><div className="adm-thumb" /></td>
            <td>UI redesign — dashboard dark mode</td>
            <td>@alex</td>
            <td>42</td>
            <td>0</td>
            <td><span className="adm-badge good">Published</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Feature</button>
                <button type="button" className="adm-btn">Hide</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><div className="adm-thumb" /></td>
            <td>Free Figma kit — landing sections</td>
            <td>@mika</td>
            <td>81</td>
            <td>2</td>
            <td><span className="adm-badge warn">Review</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Hide</button>
                <button type="button" className="adm-btn danger">Delete</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><div className="adm-thumb" /></td>
            <td>Portfolio grid — typography test</td>
            <td>@kate</td>
            <td>18</td>
            <td>0</td>
            <td><span className="adm-badge good">Published</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Feature</button>
                <button type="button" className="adm-btn">Hide</button>
              </div>
            </td>
          </tr>
          <tr>
            <td><div className="adm-thumb" /></td>
            <td>E-commerce checkout flow</td>
            <td>@sam</td>
            <td>9</td>
            <td>1</td>
            <td><span className="adm-badge warn">Review</span></td>
            <td>
              <div className="adm-actions">
                <button type="button" className="adm-btn">View</button>
                <button type="button" className="adm-btn">Restore</button>
                <button type="button" className="adm-btn danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </section>
  )
}

export default AdminPosts
