import { Link } from "react-router-dom";

const RequestDetail = ({profileToView}) => {

    return (<div className="modal-body">

        <strong>PREGUNTAS:</strong>
        <ul className="listPregu">
        {profileToView?.answers?.length > 0 && profileToView?.answers.map( (ans, i) => (
            <li key={i}>
                <strong>{ans.question.question}</strong><br/>
                <small>{ans.answer}</small>
            </li>
        ))}
        </ul>

        <hr />

        {profileToView?.attachments?.length > 0 && <>
        <strong>ANEXOS:</strong>
        <ul className="listPregu">
            {profileToView?.attachments.map( (att, i) => (
                <li key={i}>
                    <strong>{att.title}</strong><br/>
                    <Link target="_blank"
                        to={`${import.meta.env.VITE_API_BASE_URL}/${att.file}`}
                    >
                        Descargar anexo &rarr;
                    </Link><br/>
                    <small>{att.remark}</small>
                    <hr />
                </li>
            ))}
        </ul>
        </>}

        <Link className="btn btnVerCV" target="_blank"
            to={`/account/user/${profileToView?.user?.id}/resume?returnto=close`}
        >
            Ver Curriculum &rarr;
        </Link>

    </div>);
}
 
export default RequestDetail;