CREATE TABLE "contacts" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"nome" text NOT NULL,
	"email" text NOT NULL,
	"telefone" text,
	"empresa" text,
	"mensagem" text NOT NULL,
	"ficheiros" text[] DEFAULT '{}',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "news" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text NOT NULL,
	"categoria" text NOT NULL,
	"imagem" text NOT NULL,
	"imagens" text[] DEFAULT '{}',
	"tipo_galeria" text DEFAULT 'single',
	"data" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"numero_encomenda" text NOT NULL,
	"cliente_nome" text NOT NULL,
	"cliente_email" text NOT NULL,
	"cliente_telefone" text,
	"cliente_morada" text NOT NULL,
	"cliente_codigo_postal" text NOT NULL,
	"cliente_cidade" text NOT NULL,
	"cliente_nif" text,
	"itens" jsonb NOT NULL,
	"subtotal" numeric(10, 2) NOT NULL,
	"envio" numeric(10, 2) NOT NULL,
	"iva" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"estado" text DEFAULT 'pendente' NOT NULL,
	"metodo_pagamento" text NOT NULL,
	"estado_pagamento" text DEFAULT 'pendente' NOT NULL,
	"referencia_ifthenpay" text,
	"dados_pagamento" jsonb,
	"codigo_rastreio" text,
	"notas_internas" text,
	"data_pagamento" timestamp,
	"data_envio" timestamp,
	"data_entrega" timestamp,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_numero_encomenda_unique" UNIQUE("numero_encomenda")
);
--> statement-breakpoint
CREATE TABLE "page_configs" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"page" text NOT NULL,
	"section" text NOT NULL,
	"element" text NOT NULL,
	"type" text NOT NULL,
	"value" text NOT NULL,
	"default_value" text,
	"metadata" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"descricao" text NOT NULL,
	"preco" text NOT NULL,
	"imagem" text NOT NULL,
	"categoria" text NOT NULL,
	"destaque" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "service_galleries" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" text NOT NULL,
	"images" jsonb NOT NULL,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "service_galleries_service_id_unique" UNIQUE("service_id")
);
--> statement-breakpoint
CREATE TABLE "service_heroes" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"service_id" text NOT NULL,
	"badge" text,
	"title" text NOT NULL,
	"subtitle" text,
	"description" text,
	"background_image" text,
	"background_texture" text,
	"gradient_overlay" text,
	"background_color" text,
	"text_color" text,
	"overlay_opacity" text,
	"height" text,
	"primary_cta_text" text,
	"primary_cta_href" text,
	"secondary_cta_text" text,
	"secondary_cta_href" text,
	"updated_at" timestamp DEFAULT now(),
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "service_heroes_service_id_unique" UNIQUE("service_id")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"sid" varchar PRIMARY KEY NOT NULL,
	"sess" jsonb NOT NULL,
	"expire" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "slides" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"image" text NOT NULL,
	"title" text NOT NULL,
	"text" text NOT NULL,
	"order_position" text DEFAULT '1',
	"active" boolean DEFAULT true,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar,
	"first_name" varchar,
	"last_name" varchar,
	"profile_image_url" varchar,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "IDX_session_expire" ON "sessions" USING btree ("expire");