function AdminPalettes() {
  return (
    <div>
      <div className="adm-grid-kpi">
        <div className="adm-kpi">
          <span>Total generated</span>
          <strong>12482</strong>
        </div>
        <div className="adm-kpi">
          <span>Mono</span>
          <strong>7832</strong>
        </div>
        <div className="adm-kpi">
          <span>Complementary</span>
          <strong>4650</strong>
        </div>
        <div className="adm-kpi">
          <span>Retention</span>
          <strong>60 days</strong>
        </div>
      </div>

      <br />

      <section className="adm-panel">
        <h2>Palette history — all users, last 60 days only</h2>
        <p className="adm-note">Older entries are pruned. View or delete only.</p>
        <table className="adm-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Base</th>
              <th>Scheme</th>
              <th>Strip</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>@alex</td>
              <td>#3B82F6</td>
              <td><span className="adm-badge">Mono</span></td>
              <td>
                <div className="adm-swatches">
                  <span className="adm-sw" style={{ background: '#1E3A8A' }} />
                  <span className="adm-sw" style={{ background: '#3B82F6' }} />
                  <span className="adm-sw" style={{ background: '#93C5FD' }} />
                  <span className="adm-sw" style={{ background: '#DBEAFE' }} />
                  <span className="adm-sw" style={{ background: '#EFF6FF' }} />
                </div>
              </td>
              <td>2026-10-05</td>
              <td>
                <div className="adm-actions">
                  <button type="button" className="adm-btn">View</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>@mika</td>
              <td>#8B5CF6</td>
              <td><span className="adm-badge">Complementary</span></td>
              <td>
                <div className="adm-swatches">
                  <span className="adm-sw" style={{ background: '#8B5CF6' }} />
                  <span className="adm-sw" style={{ background: '#F6C65C' }} />
                  <span className="adm-sw" style={{ background: '#2E1065' }} />
                  <span className="adm-sw" style={{ background: '#FEF3C7' }} />
                  <span className="adm-sw" style={{ background: '#FFFFFF' }} />
                </div>
              </td>
              <td>2026-10-04</td>
              <td>
                <div className="adm-actions">
                  <button type="button" className="adm-btn">View</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>@kate</td>
              <td>#10B981</td>
              <td><span className="adm-badge">Mono</span></td>
              <td>
                <div className="adm-swatches">
                  <span className="adm-sw" style={{ background: '#064E3B' }} />
                  <span className="adm-sw" style={{ background: '#10B981' }} />
                  <span className="adm-sw" style={{ background: '#6EE7B7' }} />
                  <span className="adm-sw" style={{ background: '#D1FAE5' }} />
                  <span className="adm-sw" style={{ background: '#ECFDF5' }} />
                </div>
              </td>
              <td>2026-09-28</td>
              <td>
                <div className="adm-actions">
                  <button type="button" className="adm-btn">View</button>
                </div>
              </td>
            </tr>
            <tr>
              <td>@sam</td>
              <td>#EF4444</td>
              <td><span className="adm-badge">Complementary</span></td>
              <td>
                <div className="adm-swatches">
                  <span className="adm-sw" style={{ background: '#EF4444' }} />
                  <span className="adm-sw" style={{ background: '#44EFEF' }} />
                  <span className="adm-sw" style={{ background: '#7F1D1D' }} />
                  <span className="adm-sw" style={{ background: '#FECACA' }} />
                  <span className="adm-sw" style={{ background: '#FFF1F2' }} />
                </div>
              </td>
              <td>2026-09-12</td>
              <td>
                <div className="adm-actions">
                  <button type="button" className="adm-btn">View</button>
                  <button type="button" className="adm-btn danger">Delete</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        <p className="adm-note">Popular bases: Blue 28 percent, Purple 21 percent, Green 17 percent.</p>
      </section>
    </div>
  )
}

export default AdminPalettes
