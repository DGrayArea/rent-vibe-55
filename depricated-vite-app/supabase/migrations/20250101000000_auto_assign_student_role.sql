-- Create a function to automatically assign student role to new users
-- This ensures every new user gets a default student role

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- Check if user already has any role (to avoid duplicates)
  if not exists (
    select 1
    from public.user_roles
    where user_id = new.id
  ) then
    -- Assign default student role
    insert into public.user_roles (user_id, role)
    values (new.id, 'student');
  end if;
  return new;
end;
$$;

-- Create trigger to run the function when a new user is created
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

