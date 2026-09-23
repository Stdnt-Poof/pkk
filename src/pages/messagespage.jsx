
const dummy_dm = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  author: `User ${i + 1}`,
  text: `This is dummy post #${i + 1}. lorem ipsum dolor    `,
}))

function Messagespage() {
    return (
        <div className="page-layout messages-page-layout">
            <main className="chats">
                <div className="search-container">
                    <input type="search" className="Search-bar" aria-label="Search" placeholder="Search"/>
                </div>
                <div className="dm-content">
                    {dummy_dm.map((dm) => (
                        <button type="button" className='dm-item' key={dm.id}>
                            <span className="dm-avatar" aria-hidden="true" />
                            <span className="dm-meta">
                                <span className="dm-author">{dm.author}</span>
                                <span className="dm-preview">{dm.text}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </main>
            <aside className="messages"></aside>
        </div>
    )
}

export default Messagespage