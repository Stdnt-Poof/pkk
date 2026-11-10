

function Authform({children, footer}) {
    return (
        <main className="layout-login">
            <div className="login">
                <section className='login-bottom'>
                    <div className='form-inner'>{children}</div>
                    {footer && <div className='form-footer'>{footer}</div>}
                </section>
            </div>
            <div className="auth-img">
                <img className="no-drag" src="/Darktest.svg" alt="" />
            </div>
        </main>
    )
}

export default Authform