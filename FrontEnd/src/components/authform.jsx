

function Authform({children, footer}) {
    return (
        <main className="layout-login">
            <div className="login">
                <img className="auth-logo no-drag" src="/temple.svg" alt="Horizent" />
                <section className='login-bottom'>
                    <div className='form-inner'>{children}</div>
                    {footer && <div className='form-footer'>{footer}</div>}
                </section>
            </div>
        </main>
    )
}

export default Authform