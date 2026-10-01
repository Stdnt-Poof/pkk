
import { useState } from 'react'

const DUMMY_DM = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  author: `User ${i + 1}`,
  text: `temp#${i + 1}. lorem ipsum dolor emet `,
}))

function Messagespage() {
  const [activeDm, setActiveDm] = useState(null)

  return (
    <div className="page-layout messages-page-layout">
      <main className="chats">
        <div className="search-container">
          <input type="search" className="Search-bar" aria-label="Search" placeholder="Search" />
        </div>
        <div className="dm-content">
          {DUMMY_DM.map((dm) => (
            <button
              type="button"
              className={activeDm && activeDm.id === dm.id ? 'dm-item is-active' : 'dm-item'}
              key={dm.id}
              onClick={() => setActiveDm(dm)}
            >
              <div className="dm-avatar" aria-hidden="true" />
              <span className="dm-info">
                <span className="dm-author">{dm.author}</span>
                <span className="dm-preview">{dm.text}</span>
              </span>
            </button>
          ))}
        </div>
      </main>
      <aside className="messages">
        {activeDm ? (
          <section className="conversation" aria-label={`Conversation with ${activeDm.author}`}>
            <header className='dm-header'>
              <div className='dm-info'>
                <div className="dm-header-avatar" aria-hidden="true" />
                <div className='dm-header-user'>{activeDm.author}</div>
              </div>
            </header>
            <div className="conversation-body">
              {/* Message list goes here (mock data in next task) */}
            </div>
            <footer className="conversation-composer">
              <form
                className="composer-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  className="composer-input"
                  aria-label={`Message ${activeDm.author}`}
                  placeholder={`Message ${activeDm.author}`}
                />
                <button type="submit" className="composer-send">
                  Send
                </button>
              </form>
            </footer>
          </section>
        ) : (
          <div className="conversation-empty">
            <h1>Select a message</h1>
            <p>Choose a conversation from the left to start viewing it here.</p>
          </div>
        )}
      </aside>
    </div>
  )
}

export default Messagespage