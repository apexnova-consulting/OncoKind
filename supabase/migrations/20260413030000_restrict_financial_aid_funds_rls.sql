-- Restrict financial aid fund access to Advocate and Enterprise tiers.

DROP POLICY IF EXISTS "Authenticated users read financial aid funds"
  ON public.financial_aid_funds;

CREATE POLICY "Advocate and enterprise users read financial aid funds"
  ON public.financial_aid_funds FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.subscription_tier IN ('advocate', 'enterprise')
    )
  );
