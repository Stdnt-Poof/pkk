function AdminAnalytics() {
  return (
    <div>
      <div className="adm-two">
        <section className="adm-panel">
          <h2>Users</h2>
          <p className="adm-note">Total 24892</p>
          <div className="adm-bar"><i style={{ width: '100%' }} /></div>
          <br />
          <p className="adm-note">New 7d — 312</p>
          <div className="adm-bar"><i style={{ width: '18%' }} /></div>
          <br />
          <p className="adm-note">Returning WAU — 8421</p>
          <div className="adm-bar"><i style={{ width: '46%' }} /></div>
        </section>
        <section className="adm-panel">
          <h2>Social</h2>
          <p className="adm-note">Posts 42182</p>
          <div className="adm-bar"><i style={{ width: '80%' }} /></div>
          <br />
          <p className="adm-note">Replies 18230</p>
          <div className="adm-bar"><i style={{ width: '44%' }} /></div>
          <br />
          <p className="adm-note">Bookmarks 22110</p>
          <div className="adm-bar"><i style={{ width: '52%' }} /></div>
        </section>
      </div>
      <br />
      <div className="adm-two">
        <section className="adm-panel">
          <h2>Resources</h2>
          <p className="adm-note">Template views 71293</p>
          <div className="adm-bar"><i style={{ width: '95%' }} /></div>
          <br />
          <p className="adm-note">Template use 18420</p>
          <div className="adm-bar"><i style={{ width: '38%' }} /></div>
          <br />
          <p className="adm-note">Palette gens 38912</p>
          <div className="adm-bar"><i style={{ width: '66%' }} /></div>
        </section>
        <section className="adm-panel">
          <h2>Community</h2>
          <p className="adm-note">Groups created 1294</p>
          <div className="adm-bar"><i style={{ width: '30%' }} /></div>
          <br />
          <p className="adm-note">Reports total 342</p>
          <div className="adm-bar"><i style={{ width: '12%' }} /></div>
          <br />
          <p className="adm-note">Top tags: UI Design, Web Design, Design Systems, Typography</p>
        </section>
      </div>
    </div>
  )
}

export default AdminAnalytics
