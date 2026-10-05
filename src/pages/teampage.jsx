import { useState } from 'react'
import tmp from "../assets/temp.jpg"
import msgbg from "../assets/msg.svg"

function Teampage() {
    const [activeGroup, setActiveGroup] = useState(null)

    return (
        <div className="page-layout group-page-layout">
            <div className="channels">
                <div className="channel" onClick={() => setActiveGroup({ id: 1, author: 'Group 1' })}>
                    <img src={tmp}></img>
                </div>
                <div className="channel" onClick={() => setActiveGroup({ id: 2, author: 'Group 2' })}>
                    <img src={tmp}></img>
                </div>
                <div className="channel" onClick={() => setActiveGroup({ id: 3, author: 'Group 3' })}>
                    <img src={tmp}></img>
                </div>
            </div>
            <aside className="messages">
              {activeGroup ? (
                <section className="conversation">
                  <header className='dm-header'>
                    <div className='dm-info'>
                      <div className='dm-header-user'>{activeGroup.author}</div>
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

export default Teampage
