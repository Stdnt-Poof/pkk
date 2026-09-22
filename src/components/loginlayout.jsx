

function Loginlayout({head, children, footer}) {
    return (
        <main className='layout-login'>
            <section className="login-top">
                <h2>{head}</h2>
            </section>
            <section className='login-bottom'>
                <div className='form-inner'>{children}</div>
                {footer && <div className='form-footer'>{footer}</div>}
            </section>
        </main>
    )
}

export default Loginlayout