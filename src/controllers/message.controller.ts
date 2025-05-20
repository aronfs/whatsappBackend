import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import axios from 'axios';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response,
} from '@loopback/rest';
import {Message} from '../models';
import {MessageRepository} from '../repositories';
import {API_EVOLUTION_API, API_KEY_EVOLUTION_API} from '../config';

export class MessageController {
  constructor(
    @repository(MessageRepository)
    public messageRepository : MessageRepository,
  ) {}



  @post('/messages')
@response(200, {
  description: 'Message sent via Evolution API',
  content: {'application/json': {schema: getModelSchemaRef(Message)}},
})
async create(
 @requestBody({
  content: {
    'application/json': {
      schema: {
        type: 'object',
        properties: {
          number: {type: 'string', description: 'Número sin prefijo, ejemplo: "998050443"'},
          text: {type: 'string', description: 'Texto del mensaje'},
        },
        required: ['number', 'text'],
      },
    },
  },
})

  message: {number: string; text: string},
): Promise<object> {
  try {
    // Formateamos el número automáticamente
    const formattedNumber = `593${message.number}@s.whatsapp.net`;

    // Construimos el payload para Evolution API
    const payload = {
      number: formattedNumber,
      text: message.text,
    };

    const url = `${API_EVOLUTION_API.baseUrl}/message/sendText/Personal`;

    // Enviar la solicitud a Evolution API
    await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'apikey': `${API_KEY_EVOLUTION_API.apikey}`,
      },
    });

    // Guardamos el mensaje en la base de datos con la información procesada
    const savedMessage = await this.messageRepository.create({
      number: formattedNumber, // Número ya formateado
      text: message.text, // Mensaje enviado
    });

    return {success: true, data: savedMessage};
  } catch (error) {
    console.error('Error enviando mensaje:', error.response?.data || error.message);
    return {success: false, error: error.response?.data || error.message};
  }
}






  @get('/messages/count')
  @response(200, {
    description: 'Message model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Message) where?: Where<Message>,
  ): Promise<Count> {
    return this.messageRepository.count(where);
  }

  @get('/messages')
  @response(200, {
    description: 'Array of Message model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Message, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Message) filter?: Filter<Message>,
  ): Promise<Message[]> {
    return this.messageRepository.find(filter);
  }

  @patch('/messages')
  @response(200, {
    description: 'Message PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Message, {partial: true}),
        },
      },
    })
    message: Message,
    @param.where(Message) where?: Where<Message>,
  ): Promise<Count> {
    return this.messageRepository.updateAll(message, where);
  }

  @get('/messages/{id}')
  @response(200, {
    description: 'Message model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Message, {includeRelations: true}),
      },
    },
  })

  
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Message, {exclude: 'where'}) filter?: FilterExcludingWhere<Message>
  ): Promise<Message> {
    return this.messageRepository.findById(id, filter);
  }

  @patch('/messages/{id}')
  @response(204, {
    description: 'Message PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Message, {partial: true}),
        },
      },
    })
    message: Message,
  ): Promise<void> {
    await this.messageRepository.updateById(id, message);
  }

  @put('/messages/{id}')
  @response(204, {
    description: 'Message PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() message: Message,
  ): Promise<void> {
    await this.messageRepository.replaceById(id, message);
  }

  @del('/messages/{id}')
  @response(204, {
    description: 'Message DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.messageRepository.deleteById(id);
  }
}
