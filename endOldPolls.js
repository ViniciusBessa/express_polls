require('dotenv').config();
const knex = require('./db/db');

const endOldPolls = async () => {
  // Máximo de minutos que uma votação deve ficar aberta
  const numberOfMinutes = 15;
  const comparedTime = new Date();
  comparedTime.setMinutes(comparedTime.getMinutes() - numberOfMinutes);
  try {
    const polls = await knex('polls')
      .where('created_at', '<', comparedTime)
      .where({ is_active: true })
      .update({ is_active: false });
    console.log(`${polls || 0} votações foram encerradas.`);
  } catch {
    console.log(
      'Ocorreu um erro ao tentar encerrar automaticamente as votações.'
    );
  }
  process.exit(0);
};

endOldPolls();
