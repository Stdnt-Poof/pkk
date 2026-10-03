
import { useState } from 'react'
import msgbg from "../assets/msg.svg"

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
          <section className="conversation">
            <header className='dm-header'>
              <div className='dm-info'>
                <div className="dm-header-avatar" aria-hidden="true" />
                <div className='dm-header-user'>{activeDm.author}</div>
              </div>
            </header> 
            <div className="conversation-body">
            </div>
            <footer className="conversation-composer">
              <form
                className="composer-form"
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="text"
                  className="composer-input"
                  placeholder="Type a Message"
                />
              </form>
            </footer>
          </section>
        ) : (
          <div className="conversation-empty">
            <div className='msg-img-container'>
              <img className="no-drag" src={msgbg} alt="" />
            </div>
          </div>
        )}
      </aside>
    </div>
  )
}

export default Messagespage