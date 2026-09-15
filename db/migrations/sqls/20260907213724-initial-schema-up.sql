CREATE TABLE public.commodities (
    hs_code character varying(10) NOT NULL,
    description text
);



CREATE TABLE public.countries (
    iso_code character(3) NOT NULL,
    name character varying(255) NOT NULL,
    region character varying(100),
    population bigint,
    capital character varying(100),
    subregion character varying(100),
    latitude character varying(50),
    longitude character varying(50),
    currency character varying(100),
    gdp bigint
);



CREATE TABLE public.country_gdp (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    country_iso character(3) NOT NULL,
    year_end date NOT NULL,
    gdp_usd double precision NOT NULL
);



CREATE TABLE public.economic_indicators (
    country_iso3 character(3) NOT NULL,
    indicator_code character varying(20) NOT NULL,
    ref_year smallint NOT NULL,
    value numeric
);



CREATE TABLE public.indicators (
    code character varying(20) NOT NULL,
    name text NOT NULL,
    unit character varying(50)
);














CREATE TABLE public.sanctioned_entities (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    name character varying(255) NOT NULL,
    aliases text,
    entity_type character varying(100),
    entity_id character varying(20),
    title character varying(200),
    program character varying(200),
    remarks text
);



CREATE TABLE public.sanctions_addresses (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    entity_id character varying(20) NOT NULL,
    address character varying(750),
    city_state_zip character varying(116),
    country character varying(250),
    remarks character varying(200)
);



CREATE TABLE public.trade_imports (
    hs_code character varying(10) NOT NULL,
    ref_year smallint NOT NULL,
    reporter_iso character(3) NOT NULL,
    partner_iso character(3) NOT NULL,
    primary_value numeric(20,2) NOT NULL,
    qty numeric(20,3),
    pct_of_total numeric(6,5) NOT NULL
);








ALTER TABLE ONLY public.commodities
    ADD CONSTRAINT commodities_pkey PRIMARY KEY (hs_code);



ALTER TABLE ONLY public.countries
    ADD CONSTRAINT countries_pkey PRIMARY KEY (iso_code);



ALTER TABLE ONLY public.country_gdp
    ADD CONSTRAINT country_gdp_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.economic_indicators
    ADD CONSTRAINT economic_indicators_pkey PRIMARY KEY (country_iso3, indicator_code, ref_year);



ALTER TABLE ONLY public.indicators
    ADD CONSTRAINT indicators_pkey PRIMARY KEY (code);






ALTER TABLE ONLY public.sanctioned_entities
    ADD CONSTRAINT sanctioned_entities_entity_id_key UNIQUE (entity_id);



ALTER TABLE ONLY public.sanctioned_entities
    ADD CONSTRAINT sanctioned_entities_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.sanctions_addresses
    ADD CONSTRAINT sanctions_addresses_pkey PRIMARY KEY (id);



ALTER TABLE ONLY public.trade_imports
    ADD CONSTRAINT trade_imports_pkey PRIMARY KEY (hs_code, ref_year, reporter_iso, partner_iso);



CREATE INDEX idx_trade_imports_partner ON public.trade_imports USING btree (partner_iso);



CREATE INDEX idx_trade_imports_reporter ON public.trade_imports USING btree (reporter_iso);



ALTER TABLE ONLY public.country_gdp
    ADD CONSTRAINT country_gdp_country_iso_fkey FOREIGN KEY (country_iso) REFERENCES public.countries(iso_code);



ALTER TABLE ONLY public.economic_indicators
    ADD CONSTRAINT economic_indicators_country_iso3_fkey FOREIGN KEY (country_iso3) REFERENCES public.countries(iso_code);



ALTER TABLE ONLY public.economic_indicators
    ADD CONSTRAINT economic_indicators_indicator_code_fkey FOREIGN KEY (indicator_code) REFERENCES public.indicators(code);



ALTER TABLE ONLY public.sanctions_addresses
    ADD CONSTRAINT sanctions_addresses_entity_id_fkey FOREIGN KEY (entity_id) REFERENCES public.sanctioned_entities(entity_id);



ALTER TABLE ONLY public.trade_imports
    ADD CONSTRAINT trade_imports_hs_code_fkey FOREIGN KEY (hs_code) REFERENCES public.commodities(hs_code);



ALTER TABLE ONLY public.trade_imports
    ADD CONSTRAINT trade_imports_reporter_iso_fkey FOREIGN KEY (reporter_iso) REFERENCES public.countries(iso_code);



