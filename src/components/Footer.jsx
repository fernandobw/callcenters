import { FacebookFilled, InstagramOutlined,  LinkedinFilled, WhatsAppOutlined } from '@ant-design/icons';

const Footer = () => {
    const dateYear = new Date().getFullYear();

    return (
        <>
        <footer className="footer" id="footer">
            <div className="container">
            <section className="wrapSuscribete text-center"> 
                <div className="wrapForm">
                    <div className="networks">
                        MANTENTE CONECTADO CON NOSOTROS <br /><br />
                        <a href="https://www.linkedin.com/company/callcentersrd/" target="_blank" rel="noreferrer" className="social_icon"><LinkedinFilled /></a>
                    </div>
                    <br />
                    <ul className='justify-content-center mainFooter'>
                        <li><a href={import.meta.env.VITE_WORDPRESS_URL + '/directorio'}>Directorio</a></li>
                        <li><a href={import.meta.env.VITE_WORDPRESS_URL + '/sobre-nosotros'}>Contratar un call center</a></li>
                        <li><a href={import.meta.env.VITE_WORDPRESS_URL + '/noticias/'}>Noticias</a></li>
                        <li><a href={import.meta.env.VITE_WORDPRESS_URL + '/politicas-de-privacidad/'}>Políticas de privacidad</a></li>
                        <li><a href={import.meta.env.VITE_WORDPRESS_URL + '/terminos-de-uso/'}>Términos de uso</a></li>
                    </ul>
                    
                </div>
            </section>

            <p className="copy text-center m-0 pb-2">&copy; {dateYear} Call Centers Dominicanos. Todos los derechos reservados.</p>
            </div>
        </footer>
        <div className="container-fluid">
            <div className="goTop animated fadeInUp">
                <i className="fa fa-angle-double-up" aria-hidden="true"></i>
            </div>
        </div>
        <a href="https://api.whatsapp.com/send?phone=18297635773" className="wsFloating" target='_blank'><WhatsAppOutlined /></a>
        </>
    );
}
 
export default Footer;