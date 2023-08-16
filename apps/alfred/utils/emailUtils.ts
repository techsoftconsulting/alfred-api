import EmailMessage from '@shared/domain/email/email-message';

export async function sendStoreWelcomeEmail(
  { user, storeId }: any,
  storeRepo,
  mailer: any,
  emailContentParser,
) {
  const store = await storeRepo.find(storeId);

  if (!store) return;

  const link =
    store.type === 'RESTAURANT'
      ? `${process.env.RESTAURANT_PANEL_URL}/login?id=${store.slug}`
      : `${process.env.VENDOR_PANEL_URL}/login?id=${store.slug}`;

  await mailer.send(
    await getWelcomeEmailMessage({ user, emailContentParser, link }),
  );
}

export async function sendAdminWelcomeEmail(
  { user }: any,
  mailer: any,
  emailContentParser,
) {
  const link = `${process.env.ADMIN_PANEL_URL}`;

  await mailer.send(
    await getWelcomeEmailMessage({ user, emailContentParser, link }),
  );
}

export default async function getWelcomeEmailMessage({
  user,
  link,
  emailContentParser,
}: {
  user: any;
  link: any;
  emailContentParser: any;
}) {
  return new EmailMessage({
    to: {
      email: user.email,
      name: user.firstName,
    },
    subject: 'Alfred - Bienvenido',
    content: await emailContentParser.parseFromFile(
      'general/store-welcome-email.ejs',
      {
        content: `<table align='center' border='0' cellpadding='0' cellspacing='0' width='600'>

        <tr>
            <td bgcolor='#ffffff' style='padding: 40px 30px;'>
                <h1 style='color: #333333;'>Confirmación de Registro</h1>
                <p style='color: #333333;'>¡Hola ${user.firstName}!</p>
                <p style='color: #333333;'>Para ingresar al panel:  <a href='${link}' >Haz click aquí</a></p>
                <p style='color: #333333;'>Email: ${user.email}, password: ${user.password}</p>
                <p style='color: #333333;'>Podrás cambiar tu clave al iniciar sesión</p>
            </td>
        </tr>
        <tr>
            <td bgcolor='#f0f0f0' style='padding: 30px; text-align: center;'>
                <p style='color: #666666; font-size: 12px;'>Este correo electrónico es solo para fines de confirmación. Si tienes alguna pregunta o inquietud, por favor contáctanos.</p>
                <p style='color: #666666; font-size: 12px;'>&copy; 2023 Alfred. Todos los derechos reservados.</p>
            </td>
        </tr>
    </table>`,
      },
    ),
  });
}
