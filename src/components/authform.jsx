

function Authform({head, children, footer}) {
    return (
        <main className="layout-login">
            <div className="login">
                <section className="login-top">
                    <h2>{head}</h2>
                </section>
                <section className='login-bottom'>
                    <div className='form-inner'>{children}</div>
                    {footer && <div className='form-footer'>{footer}</div>}
                </section>
            </div>
            <div className="auth-img">
                <img src="/Darktest.svg" alt="" />
            </div>
        </main>
    )
}

export default Authform